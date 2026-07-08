---
name: daily-market-briefing
description: Create a daily market report for personal investment awareness
---

Create a daily market report for my personal use as an AI consultant 
and investor. Runs automatically every weekday at 4:30 PM ET via GitHub Actions.

CONTEXT
My name is Andy Kannurpatti. I run Mandala Sustainable Solutions LLC, 
an AI consulting firm in San Jose CA. I track markets for personal 
investment awareness, not trading. I want a concise, signal-focused 
report — not a news summary.

FULLY AUTONOMOUS WORKFLOW (GitHub Actions)
Runs on schedule via GitHub Actions. No local machine or manual intervention needed.

## Automatic Execution (GitHub Actions)

**When:** Every weekday at 4:30 PM ET (via GitHub Actions schedule)

**How:** The workflow `.github/workflows/daily-brief.yml` automatically:
1. Fetches live market data from Yahoo Finance + FRED APIs
2. Creates `marketBrief_[YYYY-MM-DD].json` with all live data
3. Generates `DailyBrief_[YYYY-MM-DD].html` and `email_[YYYY-MM-DD].json`
4. Commits and pushes to GitHub
5. Report published to GitHub Pages automatically

**Setup Required:**
- Store `FRED_API_KEY` as GitHub secret (Repo Settings → Secrets → Actions)
- Commit `.github/workflows/daily-brief.yml` to repo
- No local machine or manual intervention needed

**Data Sources:**
- **Equities:** Yahoo Finance (SPY, QQQ, IWM, VIX, TLT)
- **Fixed Income:** Yahoo Finance + manual (10Y, 2Y yields, HY spreads, curve calc)
- **Commodities:** Yahoo Finance (WTI, Gold, Copper, DXY)
- **Macro:** FRED API (Fed rate, CPI, jobless claims, ISM PMI)

---

## Manual Workflow (If Needed)

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

## Step 1: Collect Market Data (Manual)
```bash
export FRED_API_KEY="your_key_here"
node collectMarketData.js > marketBrief_$(date +%Y-%m-%d).json
```

## Step 2: Generate HTML & Email
```bash
node generateBrief.js marketBrief_$(date +%Y-%m-%d).json
```

Outputs:
- `DailyBrief_[YYYY-MM-DD].html` — Report ready to publish
- `email_[YYYY-MM-DD].json` — Email draft with key metrics and GitHub Pages link

Both derive from same JSON source → guaranteed consistency.

## Step 3: Publish to GitHub

```bash
cd /path/to/market-brief/repo
git add index.html archive/[YYYY-MM-DD].html
git commit -m "Daily brief [YYYY-MM-DD]"
git push origin main
```

**Live URLs:**
- Latest: https://andykannurpatti.github.io/market-brief/
- Dated: https://andykannurpatti.github.io/market-brief/archive/[YYYY-MM-DD].html

## Step 4: Email Draft

`email_[YYYY-MM-DD].json` contains the formatted email ready for your distribution list.

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

SCHEDULE & EXECUTION

**Automatic (GitHub Actions):** Every weekday (Mon–Fri) at 4:30 PM ET
- Fully autonomous, runs on GitHub's servers
- No local machine needed
- Reports publish to GitHub Pages automatically

**Setup Instructions:**
1. Add FRED_API_KEY as GitHub secret (Repo Settings → Secrets → Actions)
2. Commit `.github/workflows/daily-brief.yml` to `.github/workflows/` directory
3. Done — workflow runs on schedule automatically

**Monitor:**
- Check Actions tab in GitHub repo to see run history
- Reports appear at https://andykannurpatti.github.io/market-brief/
- Email drafts stored in repo as `email_[YYYY-MM-DD].json`
