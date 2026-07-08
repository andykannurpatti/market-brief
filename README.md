# Daily Market Briefing — Fully Autonomous System

Generates professional market reports automatically every weekday at 4:30 PM ET via GitHub Actions.

**Live Report:** https://andykannurpatti.github.io/market-brief/

---

## How It Works

**Automated Execution (GitHub Actions):**
1. Collects live market data from Yahoo Finance + FRED APIs
2. Transforms data into market analysis JSON
3. Generates HTML report
4. Publishes to GitHub Pages automatically
5. Archives dated copies

**Schedule:** Every weekday (Mon–Fri) at 4:30 PM ET

---

## Setup

### 1. Add FRED API Key as GitHub Secret

The workflow needs access to Federal Reserve Economic Data (FRED).

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `FRED_API_KEY`
4. Value: (paste your FRED API key from https://fred.stlouisfed.org/docs/api)
5. Save

**Note:** GitHub automatically provides `GITHUB_TOKEN` for git operations.

### 2. Workflow File

The workflow `.github/workflows/daily-brief.yml` is already in the repo and configured to:
- Trigger on schedule (4:30 PM ET, weekdays)
- Run `collectMarketData.js` to fetch live data
- Run `generateBrief.js` to create the HTML report
- Commit and push results to the repo
- GitHub Pages auto-publishes the report

---

## Data Sources

### Market Data (Yahoo Finance)
- **Equities:** SPY, QQQ, IWM (prices, % changes), VIX
- **Fixed Income:** 10Y/2Y Treasury yields, TLT
- **Commodities:** WTI crude oil, Gold, Copper, DXY dollar index

### Economic Data (FRED API)
- Fed funds rate
- CPI (headline year-over-year)
- Jobless claims
- ISM Manufacturing PMI

---

## File Structure

```
market-brief/
├── .github/workflows/
│   └── daily-brief.yml          ← GitHub Actions workflow
├── collectMarketData.js          ← Fetches live data from APIs
├── generateBrief.js              ← Transforms JSON → HTML
├── marketBrief_template.json     ← Schema reference
├── index.html                    ← Latest report (live on GitHub Pages)
├── archive/                      ← Dated report copies
│   └── 2026-07-08.html
└── README.md                     ← This file
```

---

## Workflow Output

**Daily Outputs:**
- `index.html` — Latest report (published to GitHub Pages)
- `archive/YYYY-MM-DD.html` — Dated copy
- `marketBrief_YYYY-MM-DD.json` — Market data source
- `DailyBrief_YYYY-MM-DD.html` — Report file

---

## Monitoring

1. **GitHub Actions:** Repo → **Actions** tab to see run history and logs
2. **Live Report:** https://andykannurpatti.github.io/market-brief/
3. **Dated Archives:** https://andykannurpatti.github.io/market-brief/archive/YYYY-MM-DD.html

---

## Manual Execution (Testing)

To run locally for testing:

```bash
# Set FRED API key
export FRED_API_KEY="your_key_here"

# Collect data
node collectMarketData.js > marketBrief_$(date +%Y-%m-%d).json

# Generate report
node generateBrief.js marketBrief_$(date +%Y-%m-%d).json

# Publish (if desired)
cp DailyBrief_*.html index.html
cp DailyBrief_*.html archive/$(date +%Y-%m-%d).html
git add index.html archive/
git commit -m "Daily brief $(date +%Y-%m-%d)"
git push origin main
```

---

## Single-Source Architecture

**Key design principle:** All outputs derive from one JSON source.

- Market data collected → `marketBrief_YYYY-MM-DD.json`
- JSON transformed → `DailyBrief_YYYY-MM-DD.html`
- HTML published → Live on GitHub Pages

**Benefits:**
- No manual transcription errors
- Consistent data across all outputs
- Safe for daily autonomous runs
- Easy to update later (regenerate from updated JSON)

---

## Technical Notes

- **Timezone handling:** Dates parsed as local time (ET) without UTC conversion
- **Node.js version:** 18.x (configured in workflow)
- **GitHub token:** Fine-grained PAT with workflow scope (required for pushing workflow files)
- **Cron schedule:** `30 20 * * 1-5` (UTC) = 4:30 PM EDT / 3:30 PM EST

---

## Development

### collectMarketData.js
Fetches live market data from Yahoo Finance + FRED APIs. Returns complete `marketBrief_[YYYY-MM-DD].json` structure ready for HTML generation.

### generateBrief.js
Transforms `marketBrief_[YYYY-MM-DD].json` into:
- `DailyBrief_[YYYY-MM-DD].html` — Formatted report with Mandala branding
- Associated market analysis JSON

Both outputs guaranteed consistent—derived from same source JSON.

---

## Contact

Andy Kannurpatti | Mandala Sustainable Solutions LLC  
San Jose, CA
