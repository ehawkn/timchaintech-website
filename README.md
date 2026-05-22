# Timechain Technologies — Website

Static HTML/CSS website for **Timechain Technologies LLC** at **timechaintech.com**.

8 pages + 1 capability statement PDF. No build step. Drop the folder onto any static host and it serves.

---

## File structure

```
timechain-site/
├── index.html                      Home
├── capabilities.html               Six capability areas (Endpoint, Patch, Mobility, Cyber, AI Ops, Teaming)
├── services.html                   Eight fixed-scope service offerings with deliverables
├── federal-contracting.html        Vendor profile, NAICS/PSC, teaming fit, subcontract scope
├── ai-operations.html              AI-Enabled Operations + "What we do not do" exclusions
├── cmmc-cyber-readiness.html       CMMC L1 / NIST 800-171 readiness with assessor disclaimer
├── about.html                      Company, founder bio, mission, five operating principles
├── contact.html                    Contact info + mailto form with inquiry types
├── capability-statement.html       Source HTML for the PDF (also browsable)
│
├── assets/
│   ├── css/site.css                Single stylesheet. Design tokens, components, all layouts.
│   ├── js/site.js                  Mobile nav, current-page highlight, mailto form handler.
│   ├── img/
│   │   ├── logo-horizontal.png     Dark logo on transparent — for white headers.
│   │   ├── logo-horizontal-light.png   White logo on transparent — for navy footers.
│   │   ├── logo-horizontal-white.png   White logo on navy panel — alternate.
│   │   └── logo-icon.png           Icon mark only — favicon + small uses.
│   └── pdf/
│       └── timechain-capability-statement.pdf   The one-page capability statement.
│
└── README.md
```

---

## Deploy to Cloudflare Pages

You already have Cloudflare DNS, so this is the path of least resistance.

**Option A — Direct upload (fastest first deploy)**

1. Sign in to the Cloudflare dashboard.
2. **Workers & Pages → Create application → Pages → Upload assets.**
3. Drag the entire `timechain-site/` folder into the upload area.
4. Name the project (e.g. `timechain`) and deploy.
5. Add custom domain `timechaintech.com` in **Pages → Settings → Custom domains.** Cloudflare auto-creates the CNAME because DNS is already on Cloudflare.

**Option B — GitHub-linked (recommended for ongoing edits)**

1. Push the `timechain-site/` contents to a private GitHub repo.
2. Cloudflare → Pages → **Connect to Git** → pick the repo.
3. Framework preset: **None.** Build command: **(empty).** Build output directory: `/`.
4. Deploy. Every push to `main` redeploys.
5. Add `timechaintech.com` as the custom domain.

**TLS** is automatic through Cloudflare. **`www → apex`** redirect is one Page Rule (`www.timechaintech.com/*` → `https://timechaintech.com/$1`).

---

## Local preview

```bash
cd timechain-site
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static server (`npx serve`, `php -S`, etc.). All paths are relative — no host config needed.

---

## Content updates

### Update the vendor profile (UEI, CAGE, SAM, SDVOSB, etc.)
Edit these locations together:
- `index.html` — the vendor snapshot table near the bottom + the hero badges + footer.
- `federal-contracting.html` — the snapshot table at the top.
- `capability-statement.html` — the snapshot strip near the top.
- Footer block at the bottom of **every page**.

Search the codebase for `HBGWBBJVYMK1` to find every occurrence.

### Update the contact info
Search for `evan@timechaintech.com` and `314-270-2188` and update consistently.

### Rebuild the capability statement PDF

```bash
wkhtmltopdf \
  --enable-local-file-access \
  --page-size Letter \
  --margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0 \
  capability-statement.html \
  assets/pdf/timechain-capability-statement.pdf
```

The source HTML is at the project root. Edit `capability-statement.html`, then re-run the command above. The PDF is single-page Letter, designed for printing and procurement submission.

If you don't have wkhtmltopdf locally, you can also open `capability-statement.html` in a browser and use **Print → Save as PDF** (set margins to "None" and paper to Letter).

### Update SAM / SDVOSB status when active
Search for `Pending Active` and `SDVOSB Pending` across all files and replace with the active status. Update the capability statement, the snapshot tables, the hero badges, and footers.

---

## Design system at a glance

- **Colors** (in `assets/css/site.css` under `:root`): `--navy-800: #141B2B` (brand), `--charcoal: #1A1A1A`, `--accent-500: #2563EB` (one controlled accent).
- **Fonts:** IBM Plex Sans + IBM Plex Mono via Google Fonts CDN, with system-font fallbacks if the CDN is blocked on a federal network.
- **Spacing scale:** `--sp-1` (4px) through `--sp-24` (96px).
- **Components:** `.btn`, `.card`, `.snapshot`, `.cta-banner`, `.offering`, `.cap-detail`, `.note`, `.exclusions`, `.stat`, `.badge`.

To rebrand: change the three CSS variables above and the logo PNGs in `assets/img/`. Every page picks up the change.

---

## Form handling note

The contact form on `contact.html` uses a **mailto:** handler — submitting opens the user's email client with a pre-formatted message addressed to `evan@timechaintech.com`. No backend, no third-party form service, no data storage.

If you want to upgrade to a hosted form later, three options that fit Cloudflare Pages:

1. **Cloudflare Pages Functions** — server-side handler at `/functions/contact.js`. Free tier covers this.
2. **Formspree / Basin / Web3Forms** — drop-in form endpoints. Free tier covers low volume.
3. **Cloudflare Worker** — custom logic, e.g. forward to email + log to KV.

All three would replace the `data-mailto` attribute and the JS handler at the bottom of `assets/js/site.js`. The form fields themselves stay the same.

---

## Content rules baked into the site

These commitments are enforced throughout the copy. Search for any violations before changing wording:

- **No claim of SAM Active until confirmed** — always shown as "Pending Active" or "Submitted."
- **No claim of SDVOSB / VetCert certification until approved** — always "Pending."
- **No claim of current clearance** — the only reference is "Founder previously held TS/SCI clearance during U.S. Air Force service."
- **No claim of CMMC certification, C3PAO status, or assessor status** — the cyber readiness page carries an explicit disclaimer.
- **No "blockchain" or crypto branding** — Timechain is a federal IT firm; the name refers to a time-anchored systems concept, not crypto.
- **AI is positioned as workflow automation, knowledge readiness, documentation acceleration, secure adoption planning** — never as model training or frontier AI.

---

## What's intentionally not in this build

For transparency on scope:

- **No analytics.** Add Plausible, Fathom, or Cloudflare Web Analytics later if needed.
- **No CMS.** Content edits are direct HTML edits. Acceptable for an 8-page federal-contracting site that changes infrequently.
- **No sitemap.xml / robots.txt.** Easy to add — drop them at the project root.
- **No SVG logo.** The PNGs were extracted from the source presentation board. If you have the original vector logo, drop an SVG in `assets/img/` and update the `<img>` references — they'll render sharper at any size.
- **No web fonts self-hosted.** Google Fonts CDN works on every federal network we've seen, with a clean system-font fallback if blocked. Self-hosting Inter or IBM Plex woff2 files is straightforward if you want full offline rendering.

---

## Quick sanity checks before going live

- [ ] Replace `evan@timechaintech.com` only if it should be different.
- [ ] Verify the capability statement PDF opens correctly.
- [ ] Test the contact form (clicks should open your email client).
- [ ] Confirm the mobile menu works (resize browser below 960px).
- [ ] Add `sitemap.xml` and `robots.txt` if SEO indexing is desired immediately.
- [ ] When SAM goes active, update all `Pending Active` references.
- [ ] When SDVOSB certifies, update all `SDVOSB Pending` references and consider adding the official VetCert badge.

---

© 2026 Timechain Technologies LLC. All rights reserved.
