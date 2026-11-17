// Refreshes data/feed.json with open/upcoming public hackathons from Devpost
// and stamps sitemap.xml <lastmod>. Runs in GitHub Actions (Node 20+, no deps).
import { readFile, writeFile } from "node:fs/promises";

const strip = (s) => String(s ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const slug = (s) => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function parseDeadline(range) {
  // Devpost gives e.g. "Nov 01 - Dec 15, 2026" — take the end date
  const t = strip(range);
  const m = t.match(/-\s*([A-Za-z]{3}\s+\d{1,2})(?:,\s*(\d{4}))?\s*$/) || t.match(/([A-Za-z]{3}\s+\d{1,2}),\s*(\d{4})\s*$/);
  if (!m) return null;
  const year = m[2] || (t.match(/(\d{4})/) || [])[1] || new Date().getUTCFullYear();
  const d = new Date(`${m[1]} ${year} 23:59:00 UTC`);
  return isNaN(d) ? null : d.toISOString();
}

async function devpost() {
  const items = [];
  for (let page = 1; page <= 4; page++) {
    const url = `https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&page=${page}`;
    const res = await fetch(url, { headers: { "User-Agent": "WinFast.com feed bot", Accept: "application/json" } });
    if (!res.ok) break;
    const json = await res.json();
    const list = json.hackathons || [];
    if (!list.length) break;
    for (const h of list) {
      const prize = strip(h.prize_amount);
      items.push({
        id: "dp-" + (h.id || slug(h.title)),
        title: strip(h.title),
        type: "hackathon",
        org: strip(h.organization_name) || "Devpost",
        url: h.url,
        region: strip(h.displayed_location?.location) || "Online",
        prize: prize && prize !== "$0" ? prize + " in prizes" : "Prizes — see page",
        frequency: (h.themes || []).map((t) => strip(t.name)).slice(0, 2).join(" · ") || "Team or solo",
        cost: "free",
        deadline: parseDeadline(h.submission_period_dates),
        summary: h.registrations_count ? `${h.registrations_count.toLocaleString("en-US")} participants registered.` : "",
        source: "devpost",
      });
    }
  }
  return items;
}

const prev = JSON.parse(await readFile("data/feed.json", "utf8").catch(() => '{"items":[]}'));
let items = [];
try { items = await devpost(); } catch (e) { console.error("Devpost fetch failed:", e.message); }

if (items.length) {
  const now = Date.now();
  items = items.filter((i) => !i.deadline || new Date(i.deadline).getTime() > now).slice(0, 60);
  await writeFile("data/feed.json", JSON.stringify({ updated: new Date().toISOString(), source: "devpost", items }, null, 1) + "\n");
  console.log(`feed.json: ${items.length} items`);
} else {
  // keep previous data, but drop anything expired
  const kept = (prev.items || []).filter((i) => !i.deadline || new Date(i.deadline) > new Date());
  await writeFile("data/feed.json", JSON.stringify({ ...prev, items: kept }, null, 1) + "\n");
  console.log("No new items; pruned expired entries.");
}

// Stamp sitemap lastmod
try {
  const today = new Date().toISOString().slice(0, 10);
  const sm = await readFile("sitemap.xml", "utf8");
  await writeFile("sitemap.xml", sm.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`));
} catch {}
