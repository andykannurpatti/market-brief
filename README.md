# Daily Market Briefing — Execution Instructions

**Schedule:** Weekdays 4:30 PM ET  
**Autonomous Run:** Yes

---

## Daily Workflow (5 Steps)

### 1. Search Web for Market Data

Collect current market data:

**Equities**
- SPY: price, % change
- QQQ: price, % change
- IWM: price, % change
- VIX: current level
- S&P 500 sector performance (top 3 gainers, top 3 losers)

**Fixed Income**
- US 10-year Treasury yield
- US 2-year Treasury yield
- Yield curve spread (10Y minus 2Y)
- HY credit spreads (bps)
- TLT (20yr Treasury ETF) % change

**Commodities**
- WTI crude oil price
- Gold price
- Copper price
- DXY dollar index

**Macro Context**
- Fed funds rate (current target range)
- Latest CPI reading (month, YoY %)
- Latest unemployment claims (weekly)
- Latest ISM Manufacturing PMI

### 2. Create marketBrief_[YYYY-MM-DD].json

Use `marketBrief_2026-07-07.json` as template (in outputs folder).

**Critical:** Set `assessment.overall_condition` field once:
```json
{
  "assessment": {
    "overall_condition": "Stretched|Caution|Neutral|etc",  ← SINGLE SOURCE
    "trend": "Bullish|Neutral|Bearish",
    "breadth": "Broad|Healthy|Narrowing|Thin",
    "stress_level": "Low|Normal|Elevated|High"
  }
}
```

This value cascades to:
- Executive Summary (1st bullet)
- Overall Condition Assessment section
- Email body

Update all data fields and synthesis text.

### 3. Generate HTML & Email

```bash
node generateBrief.js marketBrief_[YYYY-MM-DD].json
```

**Outputs:**
- `DailyBrief_[YYYY-MM-DD].html` — ready to publish
- `email_[YYYY-MM-DD].json` — email draft template

### 4. Publish to GitHub Pages

```bash
# Ensure latest repo pulled
git pull

# Create/update archive and index
mkdir -p archive
cp DailyBrief_[YYYY-MM-DD].html index.html
cp DailyBrief_[YYYY-MM-DD].html archive/[YYYY-MM-DD].html

# Commit and push
git config user.email "andykannurpatti@gmail.com"
git config user.name "Market Brief Bot"
git add index.html archive/[YYYY-MM-DD].html
git commit -m "Daily brief [YYYY-MM-DD]"
git push
```

**Live URLs:**
- Latest: https://andykannurpatti.github.io/market-brief/
- Dated: https://andykannurpatti.github.io/market-brief/archive/[YYYY-MM-DD].html

### 5. Create Email Draft

Read `email_[YYYY-MM-DD].json` and call email create_draft tool:
```
to: ["andykannurpatti@gmail.com"]
subject: "Daily Market Briefing — [YYYY-MM-DD] · Mandala"
htmlBody: [from email_[YYYY-MM-DD].json]
```

User reviews and sends from Gmail.

---

## Consistency Guarantee

All outputs (HTML + email) derive from single JSON file:

✅ Market condition stated identically everywhere  
✅ All metrics from one source  
✅ No manual variation or transcription errors  
✅ Safe for autonomous daily runs

---

## Files in Repo

- `generateBrief.js` — Generator script (transforms JSON → HTML + email)
- `index.html` — Current day's report (live on GitHub Pages)
- `archive/[YYYY-MM-DD].html` — Dated archive copies
- `README.md` — This file

---

## Template Schema

Reference: `marketBrief_2026-07-07.json` in outputs folder

Required fields:
- `date`, `assessment`, `executive_summary`
- `equities`, `fixed_income`, `commodities`, `macro`
- `watchpoints`, `disclaimer`

All synthesis/analysis text flows directly to report and email.

---

## Notes

1. **The JSON is the work.** Once created, everything else is automatic.
2. **Set `overall_condition` once** — it cascades everywhere.
3. **No manual email composition** — generated from JSON.
4. **No report editing after generation** — update JSON and regenerate.
5. **Daily consistency maintained** — no manual verification needed.

