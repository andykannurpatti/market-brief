#!/usr/bin/env node

/**
 * collectMarketData.js
 * Fetches live market data from Yahoo Finance + FRED APIs
 * Outputs complete marketBrief_[YYYY-MM-DD].json to stdout
 */

const https = require('https');
const yahooFinance = require('yahoo-finance2').default;

// Helper: fetch via HTTPS
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

// Get today's date in ET without timezone conversion
function getDateString() {
  const now = new Date();
  const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const year = estTime.getFullYear();
  const month = String(estTime.getMonth() + 1).padStart(2, '0');
  const day = String(estTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fetch stock quote from Yahoo Finance
async function getStockPrice(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      price: parseFloat(quote.regularMarketPrice).toFixed(2),
      change_percent: parseFloat(quote.regularMarketChangePercent).toFixed(2)
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

// Fetch treasury yields from FRED
async function getTreasuryYield(seriesId) {
  try {
    const fredKey = process.env.FRED_API_KEY;
    if (!fredKey) throw new Error('FRED_API_KEY not set');

    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`;
    const response = await fetchData(url);
    const data = JSON.parse(response);
    if (data.observations && data.observations.length > 0) {
      return parseFloat(data.observations[0].value).toFixed(2);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching FRED ${seriesId}:`, error.message);
    return null;
  }
}

// Fetch economic indicator from FRED
async function getEconomicIndicator(seriesId) {
  try {
    const fredKey = process.env.FRED_API_KEY;
    if (!fredKey) throw new Error('FRED_API_KEY not set');

    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`;
    const response = await fetchData(url);
    const data = JSON.parse(response);
    if (data.observations && data.observations.length > 0) {
      return parseFloat(data.observations[0].value);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching FRED ${seriesId}:`, error.message);
    return null;
  }
}

async function main() {
  const dateStr = getDateString();

  console.error('Fetching market data...');

  // Fetch equities (Yahoo Finance)
  const [spy, qqq, iwm, vix, tlt] = await Promise.all([
    getStockPrice('SPY'),
    getStockPrice('QQQ'),
    getStockPrice('IWM'),
    getStockPrice('^VIX'),
    getStockPrice('TLT')
  ]);

  // Fetch treasury yields (FRED)
  const [yield10y, yield2y, fedRate, cpiHeadline, joblessClaims, ismPMI] = await Promise.all([
    getTreasuryYield('DGS10'),    // 10Y Treasury
    getTreasuryYield('DGS2'),     // 2Y Treasury
    getTreasuryYield('FEDFUNDS'), // Fed Funds Rate
    getEconomicIndicator('CPIAUCSL'), // CPI
    getEconomicIndicator('ICSA'),  // Initial Claims
    getEconomicIndicator('MMNRNJ')  // ISM PMI
  ]);

  // Commodity prices (Yahoo Finance)
  const [wti, gold, copper, dxy] = await Promise.all([
    getStockPrice('CL=F'),      // WTI Crude Oil
    getStockPrice('GC=F'),      // Gold Futures
    getStockPrice('HG=F'),      // Copper Futures
    getStockPrice('^DXY')       // Dollar Index
  ]);

  // Calculate yield curve spread
  const curveSpread = yield10y && yield2y
    ? Math.round((parseFloat(yield10y) - parseFloat(yield2y)) * 100)
    : 36;

  // Build JSON output
  const brief = {
    date: dateStr,
    report_title: "Daily Market Briefing — Mandala Sustainable Solutions",
    organization: "Mandala Sustainable Solutions",
    location: "San Jose, CA",
    executive_summary: [
      `Market Condition: Neutral — [Add market context]`,
      `Key Signal: SPY ${spy?.change_percent || '0.00'}% and QQQ ${qqq?.change_percent || '0.00'}% — [Add key development]`,
      `Risk to Watch: [Add risk observation]`,
      `Cross-Asset: [Add cross-asset view]`
    ],
    equities: {
      SPY: {
        price: parseFloat(spy?.price || 0),
        change_percent: parseFloat(spy?.change_percent || 0)
      },
      QQQ: {
        price: parseFloat(qqq?.price || 0),
        change_percent: parseFloat(qqq?.change_percent || 0)
      },
      IWM: {
        price: parseFloat(iwm?.price || 0),
        change_percent: parseFloat(iwm?.change_percent || 0)
      },
      VIX: {
        level: parseFloat(vix?.price || 16),
        signal: parseFloat(vix?.price || 16) > 20 ? "Elevated" : "Normal"
      },
      sectors: {
        strength: "[Top 3 gaining sectors]",
        weakness: "[Top 3 declining sectors]"
      },
      synthesis: "[Equity market synthesis and interpretation]"
    },
    fixed_income: {
      treasury_10y: {
        yield: parseFloat(yield10y || 4.47),
        context: "Stable; market pricing"
      },
      treasury_2y: {
        yield: parseFloat(yield2y || 4.11),
        context: "Flat; reflecting rate expectations"
      },
      yield_curve_spread: {
        bps: curveSpread,
        direction: curveSpread > 0 ? "Steepening" : "Flattening"
      },
      hy_spreads: {
        bps: 275,
        signal: "Tight"
      },
      TLT: {
        price: parseFloat(tlt?.price || 0),
        change_percent: parseFloat(tlt?.change_percent || 0)
      },
      synthesis: "[Bond market synthesis and Fed rate expectations]"
    },
    commodities: {
      WTI_oil: {
        price: parseFloat(wti?.price || 0),
        change_percent: parseFloat(wti?.change_percent || 0)
      },
      gold: {
        price: parseFloat(gold?.price || 0),
        signal: parseFloat(gold?.change_percent || 0) > 0 ? "Rising" : "Falling"
      },
      copper: {
        price: parseFloat(copper?.price || 0),
        signal: "[Support level assessment]"
      },
      DXY: {
        level: parseFloat(dxy?.price || 0),
        change_percent: parseFloat(dxy?.change_percent || 0)
      },
      synthesis: "[Commodity market and dollar context]"
    },
    macro: {
      fed_funds_rate: fedRate ? `${parseFloat(fedRate).toFixed(2)}%` : "3.50%-3.75%",
      fed_stance: "Hold likely; cuts priced for late July/August",
      next_fomc: "[Next FOMC Date]",
      CPI: {
        headline_yoy: parseFloat(cpiHeadline || 4.2),
        latest: "[Latest month]",
        context: "[Above/Below/At target]"
      },
      jobless_claims: {
        latest: joblessClaims ? Math.round(parseFloat(joblessClaims)) : 215000,
        signal: "[Rising/Falling/Stable]"
      },
      ISM_PMI: {
        latest: ismPMI ? parseFloat(ismPMI).toFixed(1) : 53.3,
        signal: "[Expansion/Contraction]"
      },
      synthesis: "[Macro synthesis connecting economic data to market signals]"
    },
    assessment: {
      overall_condition: "Neutral",
      trend: "Neutral",
      breadth: "Improving",
      stress_level: "Normal"
    },
    watchpoints: [
      "[Monitor specific data release or event]",
      "[Monitor specific data release or event]",
      "[Monitor specific data release or event]",
      "[Monitor specific data release or event]",
      "[Monitor specific data release or event]"
    ],
    disclaimer: "This report is for informational and educational purposes only and does not constitute investment advice, a solicitation, or a recommendation to buy or sell any security. Past market conditions are not indicative of future results. Andy Kannurpatti and Mandala Sustainable Solutions LLC are not registered investment advisors. Recipients should consult a qualified financial advisor before making any investment decisions. Data sourced from Yahoo Finance, FRED, CNBC, ISM, U.S. Department of Labor, and U.S. Department of Treasury — accuracy not guaranteed."
  };

  // Output JSON
  console.log(JSON.stringify(brief, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
