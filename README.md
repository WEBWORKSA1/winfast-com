# WinFast.com

The fast lane to free-to-enter sweepstakes, hackathons, prize challenges, scholarships and creative competitions — plus free giveaway tools, Win Alerts, brand promotion services, donations and WinFast skill contests.

Static site · GitHub Pages ready (main branch, root) · AdSense-ready · self-updating feed via GitHub Actions.

## Structure
- `*.html`, `tools/`, `guides/` — generated pages (built automatically by `.github/workflows/build-site.yml` on every push to `scripts/` or `data/`)
- `assets/` — CSS, JS, images
- `data/opportunities.json` — curated listings (edit by hand)
- `data/feed.json` — live hackathon feed (auto-updated daily by `.github/workflows/update-feed.yml`)
- `data/contests.json` — contest rounds (edit to open/close rounds)
- `scripts/build.py` + `scripts/pages_*.py` — page generator. Edit content, then run `python3 scripts/build.py` (or just push and let the Action build)
- `docs/BUILD-PROMPT.md` — concept, revenue model, research and phase-wise build prompt

## Deploy
Settings → Pages → Deploy from a branch → `main` / `(root)`. For the custom domain, add `winfast.com` in Pages settings and point DNS to GitHub Pages.

## Trademark notice
"WinFast.com" is used only as a descriptive domain ("win fast"). This site is not affiliated with Leadtek Research Inc. or any owner of the "WinFast" trademark.
