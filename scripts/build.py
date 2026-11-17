#!/usr/bin/env python3
"""WinFast.com static page generator.
Run from repo root:  python3 scripts/build.py
Edit page content in scripts/pages_*.py, then rebuild. Output: page bodies with Jekyll front matter +
_layouts/default.html (shared chrome). GitHub Pages renders them natively on push.
"""
import json, os, sys, html
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
SITE = "https://winfast.com"
ADSENSE = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>'
INTEREST_URL = "https://web.works/contact"
PAGES = []  # (path, priority)

TOOLS = [
    ("giveaway-picker", "Giveaway Winner Picker", "🎯"),
    ("spin-wheel", "Spin the Wheel", "🎡"),
    ("random-number", "Random Number Generator", "🔢"),
    ("odds-calculator", "Odds of Winning Calculator", "📊"),
    ("prize-tax-estimator", "Prize Tax Estimator", "🧾"),
    ("entry-tracker", "Entry Tracker", "🗂️"),
    ("rules-generator", "Official Rules Generator", "📜"),
    ("deadline-countdown", "Deadline Countdown & Calendar", "⏱️"),
]

LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0b1020" d="M13.5 2 4 13.6h6.3L9 22l10-12.4h-6.4z"/></svg>'


def header(root, active):
    def a(href, label):
        cur = ' aria-current="page"' if active == href else ""
        return f'<a href="{root}{href}"{cur}>{label}</a>'
    tools = "".join(f'<li>{a("tools/" + s + ".html", e + " " + n)}</li>' for s, n, e in TOOLS)
    return f'''<a class="skip" href="#main">Skip to content</a>
<div class="interest-bar"><a href="{INTEREST_URL}" target="_blank" rel="noopener">📩 Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership</a></div>
<header class="site-header"><div class="wrap nav">
<a class="brand" href="{root}index.html" aria-label="WinFast.com home"><span class="mark">{LOGO}</span><span>WinFast<small>.com</small></span></a>
<button class="icon-btn burger" aria-label="Open menu" aria-expanded="false">☰</button>
<ul class="menu">
<li>{a("opportunities.html", "Opportunities")}</li>
<li><button aria-haspopup="true">Tools ▾</button><ul class="dropdown">{tools}<li>{a("tools/index.html", "All tools →")}</li></ul></li>
<li><button aria-haspopup="true">Learn ▾</button><ul class="dropdown"><li>{a("guides/index.html", "📚 Guides")}</li><li>{a("videos.html", "▶️ Video hub")}</li><li>{a("playbook.html", "⚡ Fast-Win Playbook")}</li><li>{a("faq.html", "❓ FAQ")}</li></ul></li>
<li>{a("contests.html", "Contests")}</li>
<li>{a("promote.html", "For Brands")}</li>
<li>{a("support.html", "Support")}</li>
<li><a class="btn btn-lime" href="{root}alerts.html">Get Win Alerts</a></li>
<li><button class="icon-btn theme-toggle" aria-label="Toggle light/dark theme">🌓</button></li>
</ul></div></header>'''


def footer(root):
    return f'''<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><a class="brand" href="{root}index.html"><span class="mark">{LOGO}</span><span>WinFast<small>.com</small></span></a>
<p class="muted" style="margin-top:12px">The fast lane to free-to-enter sweepstakes, contests, hackathons, prize challenges and scholarships — plus fair, free giveaway tools.</p>
<a class="btn btn-lime btn-sm" href="{root}alerts.html">Get weekly Win Alerts</a></div>
<div><h4>Explore</h4><ul><li><a href="{root}opportunities.html">All opportunities</a></li><li><a href="{root}opportunities.html?type=hackathon">Hackathons</a></li><li><a href="{root}opportunities.html?type=scholarship">Scholarships</a></li><li><a href="{root}guides/index.html">Guides</a></li><li><a href="{root}videos.html">Videos</a></li><li><a href="{root}contests.html">WinFast Contests</a></li></ul></div>
<div><h4>Tools</h4><ul>{"".join(f'<li><a href="{root}tools/{s}.html">{n}</a></li>' for s, n, e in TOOLS[:6])}</ul></div>
<div><h4>Company</h4><ul><li><a href="{root}about.html">About</a></li><li><a href="{root}promote.html">Promote a contest</a></li><li><a href="{root}advertise.html">Advertise &amp; partner</a></li><li><a href="{root}careers.html">Careers</a></li><li><a href="{root}support.html">Donate / Support</a></li><li><a href="{root}submit.html">Submit an opportunity</a></li><li><a href="{root}contact.html">Contact</a></li></ul></div>
<div><h4>Legal</h4><ul><li><a href="{root}privacy.html">Privacy Policy</a></li><li><a href="{root}terms.html">Terms of Use</a></li><li><a href="{root}disclaimer.html">Disclaimer &amp; Trademark</a></li><li><a href="{root}cookies.html">Cookie Policy</a></li><li><a href="{root}editorial-policy.html">Editorial Policy</a></li><li><a href="{root}contest-rules.html">Official Contest Rules</a></li><li><a href="{root}sitemap.html">Sitemap</a></li></ul></div>
</div>
<div class="legal-note">
<p><strong>Trademark &amp; copyright disclosure:</strong> “WinFast.com” is used here only as a descriptive domain name meaning “win fast”. This website is independent and is not affiliated with, endorsed by, or sponsored by Leadtek Research Inc. or any owner of the “WinFast” trademark or WinFast-branded products. All third-party names, logos and trademarks belong to their respective owners and are used for identification only. Listings link to official sponsor pages; we do not run, guarantee or judge third-party promotions. Site content © <span class="year"></span> WinFast.com. All rights reserved. <a href="{root}disclaimer.html">Full disclaimer</a>.</p>
<p>No purchase is ever necessary to enter a legitimate sweepstakes. Void where prohibited. WinFast.com does not list gambling, betting, lottery-ticket sales or “sweepstakes casino” sites.</p>
</div></div></footer>
<div class="sticky-cta" role="complementary"><p>⚡ Get the best free-to-enter wins every week</p><a class="btn btn-lime btn-sm" href="{root}alerts.html">Send me Win Alerts</a><button class="x" aria-label="Dismiss">✕</button></div>
<div class="consent" role="dialog" aria-label="Cookie notice"><p>We use cookies to run this site, measure traffic and show ads through Google AdSense. Google and its partners may use cookies to personalise ads. See our <a href="{root}cookies.html">Cookie Policy</a>.</p><div style="display:flex;gap:8px"><button class="btn btn-lime btn-sm" data-consent="all">Accept</button><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button></div></div>
<div class="modal" id="exit-modal" aria-hidden="true"><div class="box"><button class="close" aria-label="Close">×</button>
<span class="eyebrow">Before you go</span><h2>Never miss a fast win</h2><p class="muted">One short email a week: the newest free-to-enter sweepstakes, hackathons and prize challenges — plus deadlines ending soon.</p>
<form class="wf-form form" data-subject="Exit-intent Win Alerts signup" data-lead="1" data-autoresponse="Thanks for joining WinFast Win Alerts! Your free Fast-Win Playbook is here: {SITE}/playbook.html — your first alert arrives this week." data-success="You're in! Check your inbox for the Fast-Win Playbook.">
<div class="hp"><input name="_hp" tabindex="-1" autocomplete="off"></div>
<input type="email" name="email" placeholder="you@email.com" required aria-label="Email">
<select name="Interest" aria-label="Main interest"><option>Everything</option><option>Sweepstakes &amp; giveaways</option><option>Hackathons &amp; tech challenges</option><option>Scholarships</option><option>Creative competitions</option></select>
<label class="check"><input type="checkbox" name="Consent" value="Yes" required> I agree to receive emails and accept the <a href="{root}privacy.html">Privacy Policy</a>. Unsubscribe anytime.</label>
<button class="btn btn-lime" type="submit">Get Win Alerts — free</button><div class="form-msg" role="status"></div></form></div></div>'''


LAYOUT_ROOT = "{{ page.root }}"


def write_layout():
    """Shared chrome lives in one Jekyll layout (GitHub Pages builds it natively)."""
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    r = LAYOUT_ROOT
    doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{{{ page.title | escape }}}}</title>
<meta name="description" content="{{{{ page.description | escape }}}}">
<link rel="canonical" href="{{{{ page.canonical }}}}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0b1020">
<meta property="og:type" content="{{{{ page.og_type | default: 'website' }}}}"><meta property="og:site_name" content="WinFast.com">
<meta property="og:title" content="{{{{ page.title | escape }}}}"><meta property="og:description" content="{{{{ page.description | escape }}}}">
<meta property="og:url" content="{{{{ page.canonical }}}}"><meta property="og:image" content="{SITE}/assets/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="google-adsense-account" content="ca-pub-6620975821265271">
{ADSENSE}
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{r}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{r}assets/css/style.css">
</head>
<body data-root="{r}" data-page="{{{{ page.path }}}}">
{header(r, None)}
<main id="main">
{{{{ content }}}}
</main>
{footer(r)}
<script src="{r}assets/js/app.js" defer></script>
</body>
</html>
'''
    os.makedirs(os.path.join(base, "_layouts"), exist_ok=True)
    with open(os.path.join(base, "_layouts", "default.html"), "w", encoding="utf-8") as f:
        f.write(doc)


def _yaml(s):
    return json.dumps(s, ensure_ascii=False)  # JSON strings are valid YAML scalars


def page(path, title, desc, body, active=None, scripts="", schema=None, priority="0.7", og_type="website"):
    depth = path.count("/")
    root = "../" * depth
    url = f"{SITE}/{path}".replace("/index.html", "/")
    ld = ""
    base_ld = {"@context": "https://schema.org", "@type": "WebSite", "name": "WinFast.com", "url": SITE + "/",
               "potentialAction": {"@type": "SearchAction", "target": SITE + "/opportunities.html?q={query}", "query-input": "required name=query"}}
    if path == "index.html":
        ld += f'<script type="application/ld+json">{json.dumps(base_ld)}</script>'
    if schema:
        ld += f'<script type="application/ld+json">{json.dumps(schema)}</script>'
    fm = (f"---\nlayout: default\ntitle: {_yaml(title)}\ndescription: {_yaml(desc)}\ncanonical: {_yaml(url)}\n"
          f"root: {_yaml(root)}\nog_type: {og_type}\n---\n")
    doc = fm + "{% raw %}" + body + ld + scripts + "{% endraw %}\n"
    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(doc)
    if path != "404.html":
        PAGES.append((path, priority))


def head(title, sub, crumbs=None, eyebrow=None):
    c = f'<div class="crumbs">{crumbs}</div>' if crumbs else ""
    e = f'<span class="eyebrow">{eyebrow}</span>' if eyebrow else ""
    return f'<section class="page-head"><div class="wrap">{c}{e}<h1>{title}</h1><p>{sub}</p></div></section>'


def write_sitemap():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    today = date.today().isoformat()
    urls = "".join(
        f"<url><loc>{SITE}/{p}".replace("/index.html", "/") + f"</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>\n"
        for p, pr in sorted(PAGES))
    with open(os.path.join(root, "sitemap.xml"), "w") as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')


if __name__ == "__main__":
    import pages_main, pages_tools, pages_guides
    pages_guides.build(page, head)
    pages_tools.build(page, head, TOOLS)
    pages_main.build(page, head, TOOLS, pages_guides.GUIDES)
    write_sitemap()
    write_layout()
    print(f"Built {len(PAGES)} pages")
