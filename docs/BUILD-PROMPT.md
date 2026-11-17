# WinFast.com — Concept, Revenue Model & Phase-Wise Build Prompt

## 1. The winning idea

**WinFast.com = "The fast lane to winning":** a directory of free-to-enter opportunities (sweepstakes, hackathons, prize challenges, scholarships, creative competitions) plus a suite of free giveaway tools, a brand lead-gen engine, and its own skill contests.

### Why this beats other "win fast" angles

| Option | Traffic potential | AdSense safety | Lead-gen value | Verdict |
|---|---|---|---|---|
| Sports betting / lottery tips | High | **Restricted (gambling)** | Low | Reject |
| "Quick wins" productivity blog | Medium | Safe | Low | Thin moat |
| Gaming speedruns | Medium | Safe | Low | Weak monetisation |
| **Opportunity directory + giveaway tools + brand services** | **High (daily-return habit + evergreen tool searches)** | **Safe if gambling is excluded** | **Two-sided (consumers + brands)** | **Chosen** |

### Revenue engines (in order of expected contribution)
1. **AdSense on high-frequency pages.** Daily entrants come back every day and view many pages per session. Tool pages (spin wheel, winner picker, random number) rank for evergreen, high-volume searches.
2. **B2B lead generation (highest value per lead).** Brands, creators, agencies and hackathon hosts pay for reach: featured listing $49/wk, launch bundle $199, done-for-you giveaway from $750, category sponsorship. Comparable directories charge for listings (e.g. SweepsAdvantage at $10/mo for unlimited postings, and some directories at $25–$50 per listing).
3. **Owned email list (Win Alerts).** Monetised through newsletter sponsorships and as the distribution channel for brand campaigns.
4. **Donations and sponsor pledges.** These fund contest prizes, curation, marketing and hiring.
5. **Later expansion:** premium tier (ad-free + alerts + win tracker, a proven model at commentpicker/sweepsadvantage/sweepstakesbible), affiliate (scholarship/education, tools), data/API syndication.

### Competitive research (sites reviewed)
Directly fetched and analysed: Contest Girl, SweepstakesBible, Sweepstakes Advantage, Online-Sweepstakes, Contest Scoop, ContestCanada, Contest Library (CA), Canadian Free Stuff, Contest Bee, Competition Database (UK), Loquax (UK), The Freebie Guy, Comment Picker, Wheel of Names, Picker Wheel, Randomizer.org, Uplup, Gleam, SweepWidget, KingSumo, ViralSweep, Woobox, RafflePress, Devpost, MLH, HackerEarth, Topcoder, HeroX, Kaggle, Challenge.gov (now sunset), Fastweb, Scholarships.com, IRS Topic 419. Also reviewed via search: Replient, Inro, KickoffLabs, Hackalist, Contest Hopper, JudgeBoard, SweepSheet, ThePrizeFinder (offline for rebuild).

**Patterns adopted:** entry-frequency and prize-type filters, "ending soon" sorting, per-listing fields (prize/ARV, eligibility, entry limit, deadline, official link), favourites and entry tracking, a free-tools hub, crypto-random pickers with certificates, submit-a-listing and paid-feature tiers, newsletter capture across the site, "host a challenge" B2B funnels, and how-to/scam/tax guides.

**Gaps WinFast fills:** no competitor combines all of these: consumer sweepstakes, dev hackathons, scholarships, creative awards, transparent tools, and a brand-services funnel in one modern, fast, mobile-first UI.

---

## 2. Phase-wise build prompt (reusable)

> Use these phases in order with an AI builder or dev team. Each phase is self-contained and testable.

### Phase 0 — Foundations & compliance
"Create a static website for **WinFast.com** deployable on GitHub Pages (free plan, `main` branch, root folder). Use plain HTML/CSS/JS only (no build server). Every page `<head>` must include the AdSense code `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`, the `google-adsense-account` meta tag, a canonical URL, OG/Twitter tags and JSON-LD. Add `ads.txt` (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), `robots.txt`, `sitemap.xml`, `.nojekyll`, `manifest.webmanifest`, an SVG favicon, and a 404 page. At the very top of every page, show a full-width bar reading 'Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership' linking to https://web.works/contact (link text only, URL never shown). Never list gambling, betting, casino, sweepstakes-casino or lottery-ticket products."

### Phase 1 — Design system & layout
"Build a modern dark-first design system with an optional light theme: navy base, electric-lime primary, sky/coral/gold accents; Inter plus Space Grotesk; cards, chips, pills, buttons and form controls; a sticky blurred header with dropdown menus (Opportunities, Tools, Learn, Contests, For Brands, Support, 'Get Win Alerts' CTA, theme toggle); a mobile slide-in menu; a 5-column footer with the trademark/copyright disclosure; a cookie notice; a sticky CTA bar after scroll; and an exit-intent lead modal (once per 7 days). Make it fully responsive and accessible (skip link, focus states, reduced-motion)."

### Phase 2 — Opportunity engine (self-updating)
"Create `data/opportunities.json` with curated, evergreen, real programmes (official URLs only, no invented dates) and `data/feed.json` for live items. Write `scripts/update-feed.mjs` (Node 20, no dependencies) that pulls open/upcoming hackathons from Devpost's public JSON, normalises them (title, org, url, region, prize, themes, deadline), drops expired items and stamps the sitemap `lastmod`. Add a GitHub Actions workflow that runs it daily, commits changes and requests a Pages rebuild. In the browser, merge both files, auto-hide expired listings, render cards with live countdowns, rotate 'Today's Fast Wins' daily with a date seed, and support search, type/cost filters, sort, quick chips, URL-synced filters and ☆ save to localStorage."

### Phase 3 — Free tools (traffic magnets)
"Build eight client-side tools, each on its own SEO page with WebApplication and FAQPage schema: (1) Giveaway Winner Picker with keyword/exclude filters, dedupe by handle, multiple winners plus alternates, Web Crypto rejection-sampling, a SHA-256 list fingerprint and a downloadable draw certificate; (2) Spin the Wheel (canvas, crypto-chosen result, remove-winner mode, history); (3) Random Number Generator; (4) Odds-of-Winning Calculator (exact draw-without-replacement odds plus a yearly portfolio estimate); (5) Prize Tax Estimator (US marginal-rate method plus Canada windfall rule); (6) Entry Tracker (daily due flags, wins log, import saved items, CSV export); (7) Official Rules Generator (Meta disclaimer and Canada skill-testing toggles); (8) Deadline Countdown with .ics export."

### Phase 4 — Content for AdSense approval
"Write 12+ original, substantive guides (600–900 words) with Article schema, breadcrumbs, related links and an inline email capture: how to win sweepstakes; sweepstakes vs contests vs lotteries; spotting prize scams; prize taxes US/Canada; how to win a hackathon; Canada's skill-testing question; running a legal giveaway; instant-win mechanics; creative competitions; scholarship competitions; entry-tracking systems; provably fair draws. Add About, Contact, FAQ, Privacy (with Google advertising-cookie disclosures and opt-out links), Terms, Disclaimer & Trademark, Cookie Policy, Editorial Policy and an HTML sitemap. Do not publish thin or copied content."

### Phase 5 — Lead generation (dedicated, high-converting)
"Create a dedicated `alerts.html` landing page plus a homepage section with a 3-step micro-commitment form (interests → country/frequency → name/email + consent), a lead magnet (`playbook.html`, delivered through the form auto-response), progress bars, trust microcopy and FAQ. Also add a hero inline form, the exit-intent modal, the sticky bar and in-article forms. For brands, build `promote.html` with 4 pricing tiers and a 3-step quote form (type/package → budget/goals → contact). Route all forms through FormSubmit AJAX to the owner inbox. Assemble the address in JavaScript at submit time so it never appears in page text or HTML. Include a honeypot field, a table template, a subject prefix, and success/error states."

### Phase 6 — Donations, sponsorship, contests, hiring
"`support.html`: preset and custom amounts, a 'direct my support to' selector (operations, prizes, marketing, hiring, tools), a monthly toggle, and a PayPal donate URL built at click time (address hidden). Show a target-allocation chart and a sponsor/prize pledge form. `contests.html`: rounds driven by `data/contests.json` (upcoming/open/closed/archived), free skill-based entries judged on published criteria, an entry form, and full official rules including Canada's skill-testing question. `careers.html`: role cards plus an application form. `advertise.html`: category, prize, newsletter and tool sponsorships, data partners, and domain/website acquisition interest linking to web.works/contact."

### Phase 7 — Media & engagement
"`videos.html`: privacy-enhanced lite YouTube embeds that load the iframe only on click, using verified video IDs, plus topic search chips. Reuse the embeds on the homepage."

### Phase 8 — QA, launch & growth
"Run headless-browser tests: zero console errors on every page, all tools work, forms post, donate URL builds, favourites persist, mobile menu works. Grep the build to confirm the inbox address never appears. Push to GitHub, enable Pages (main/root), add the custom domain `winfast.com` (CNAME plus DNS A/AAAA records to GitHub Pages IPs, enforce HTTPS), verify in Google Search Console, submit the sitemap, then apply for AdSense and enable Auto ads plus Google's consent message for EEA/UK. Growth: programmatic pages per category × region, weekly Win Alerts, a YouTube Shorts tool demos channel, outreach to brands from the submit queue."

### Phase 9 — Expansion roadmap
Premium tier (ad-free, instant alerts, cloud tracker); country hubs (US/CA/UK/IN/AU); organiser self-serve dashboard; a public API for opportunity data; additional feed sources (organiser RSS/APIs); community winners' wall; multilingual pages.

---

## 3. Owner checklist after deploy
1. **FormSubmit activation:** the first form submission triggers a one-time confirmation email to the owner inbox. Click "Activate" once.
2. **PayPal:** donations go to the PayPal account tied to the owner inbox; make sure that account exists and is verified.
3. **GitHub Pages:** Settings → Pages → Source "Deploy from a branch" → `main` / root.
4. **Custom domain:** add `winfast.com` in Pages settings (creates `CNAME`), then point DNS to GitHub Pages and tick "Enforce HTTPS".
5. **AdSense:** add the site, keep `ads.txt` at root, turn on Auto ads, and set up the Privacy & messaging consent banner for EEA/UK.
6. **Contests:** edit `data/contests.json` to open a round once a prize is funded.
