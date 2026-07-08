---
name: daily-market-briefing
description: Create a daily market report for personal investment awareness
---

Create a daily market report for my personal use as an AI consultant 
and investor. Run this every weekday at 4:30 PM ET.

CONTEXT
My name is Andy Kannurpatti. I run Mandala Sustainable Solutions LLC, 
an AI consulting firm in San Jose CA. I track markets for personal 
investment awareness, not trading. I want a concise, signal-focused 
report — not a news summary.

WORKFLOW (4 Steps)

## Step 1: Search Web for Market Data
Collect current market data for all categories:

**Equities:** SPY (price, % change), QQQ (price, % change), IWM (price, % change), 
VIX (level), S&P 500 sector performance (top 3 gainers, top 3 losers)

**Fixed Income:** US 10Y Treasury yield, US 2Y Treasury yield, yield curve spread 
(10Y minus 2Y), HY credit spreads (bps), TLT (20yr Treasury ETF) % change

**Commodities:** WTI crude oil price, Gold price, Copper price, DXY dollar index, 
all with direction/change

**Macro Context:** Fed funds rate (current target range), latest CPI (headline % YoY), 
latest weekly jobless claims, latest ISM Manufacturing PMI

## Step 2: Create marketBrief_[YYYY-MM-DD].json

Use the provided JSON template. Update all data fields:
- date
- executive_summary (4 bullet points)
- equities (SPY, QQQ, IWM, VIX, sectors, synthesis)
- fixed_income (10Y, 2Y, curve spread, HY spreads, TLT, synthesis)
- commodities (WTI, gold, copper, DXY, synthesis)
- macro (Fed rate, CPI, jobless claims, ISM PMI, synthesis)
- assessment.overall_condition (Healthy/Stretched/Caution/Stressed) ← **SINGLE SOURCE**
- assessment.trend, breadth, stress_level
- watchpoints (3-5 bullets)

**CRITICAL:** Set `assessment.overall_condition` once. This value cascades to:
- Executive Summary (1st bullet)
- Overall Condition Assessment section
- Email subject + body

## Step 3: Generate HTML & Email Draft

```bash
node generateBrief.js marketBrief_[YYYY-MM-DD].json
```

**Outputs:**
- `DailyBrief_[YYYY-MM-DD].html` — Report ready to publish
- `email_[YYYY-MM-DD].json` — Email draft with key metrics and GitHub Pages link

Both outputs derive from the same JSON source → guaranteed consistency.

**Note on generateBrief.js:** 
- Version includes timezone-aware date formatting fix
- Dates parse correctly regardless of system timezone (YYYY-MM-DD → local day display)
- Tested: 2026-07-08 correctly displays as "Wednesday, July 8, 2026"

## Step 4a: Publish to GitHub Pages

**Token Status:** ✅ Fine-grained GitHub PAT stored securely in `~/.git-credentials`
(No additional setup required — token is already configured)

```bash
cd /path/to/market-brief/repo

# Pull latest
git pull

# Create archive directory if needed
mkdir -p archive

# Copy HTML to index (live) and archive (dated)
cp DailyBrief_[YYYY-MM-DD].html index.html
cp DailyBrief_[YYYY-MM-DD].html archive/[YYYY-MM-DD].html

# Configure git to use stored token (already configured globally)
# If needed: git config --global credential.helper store

# Commit and push (automatically uses stored token for authentication)
git config user.email "andykannurpatti@gmail.com"
git config user.name "Daily Market Brief Bot"
git add index.html archive/[YYYY-MM-DD].html
git commit -m "Daily brief [YYYY-MM-DD]"
git push origin main
```

The `git push` command will automatically use the stored GitHub token from `~/.git-credentials` for authentication.

**Live URLs:**
- Latest: https://andykannurpatti.github.io/market-brief/
- Dated: https://andykannurpatti.github.io/market-brief/archive/[YYYY-MM-DD].html

## Step 4b: Create Email Draft

Read `email_[YYYY-MM-DD].json` and call Gmail create_draft tool:
```
to: ["andykannurpatti@gmail.com"]
subject: email_[YYYY-MM-DD].json.subject
htmlBody: email_[YYYY-MM-DD].json.htmlBody
```

Email draft is ready in Gmail for review and send to mailing list.

---

CONSISTENCY GUARANTEE

All outputs (HTML + email) derive from the single JSON file:
✅ Market condition stated identically everywhere
✅ All metrics from one source
✅ No manual transcription errors
✅ Safe for daily autonomous runs
✅ Easy to update later—just regenerate from updated JSON

---

FILES

- `generateBrief.js` — Generator script (node-based, transforms JSON → HTML + email)
- `marketBrief_[YYYY-MM-DD].json` — Single source of truth for each day's data
- `DailyBrief_[YYYY-MM-DD].html` — Generated report (publish to GitHub)
- `email_[YYYY-MM-DD].json` — Generated email draft template
- `index.html` — Latest report (live on GitHub Pages)
- `archive/` — Dated archive of all past reports

---

TEMPLATE SCHEMA

Reference the provided `marketBrief_template.json` for required fields:
- date, report_title, organization, location
- executive_summary (array of 4 strings)
- equities, fixed_income, commodities, macro (nested objects with all data)
- assessment (overall_condition, trend, breadth, stress_level)
- watchpoints (array of 3-5 strings)
- disclaimer

---

SCHEDULE

Every weekday (Monday–Friday) at 4:30 PM ET
