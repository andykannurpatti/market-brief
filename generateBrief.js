#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the market data JSON
const dataPath = process.argv[2] || './marketBrief.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const MANDALA_GREEN = '#2A5740';
const MANDALA_SAGE = '#EFF4ED';

// ============================================================================
// HTML GENERATOR
// ============================================================================
function generateHTML(data) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPercent = (val) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Market Briefing — ${data.date} · Mandala Sustainable Solutions</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: ${MANDALA_SAGE};
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        header {
            background-color: ${MANDALA_GREEN};
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        header h1 {
            font-size: 28px;
            margin-bottom: 5px;
            font-weight: 600;
        }
        header .subtitle {
            font-size: 14px;
            opacity: 0.95;
            letter-spacing: 0.5px;
        }
        .report-date {
            color: white;
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.85;
        }
        .section {
            background: white;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .section h2 {
            color: ${MANDALA_GREEN};
            font-size: 20px;
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 2px solid ${MANDALA_SAGE};
            font-weight: 600;
        }
        .bullet-list {
            list-style: none;
            padding: 0;
        }
        .bullet-list li {
            padding: 8px 0 8px 25px;
            position: relative;
            font-size: 14px;
            line-height: 1.7;
        }
        .bullet-list li:before {
            content: "•";
            position: absolute;
            left: 8px;
            color: ${MANDALA_GREEN};
            font-weight: bold;
            font-size: 16px;
        }
        .metric {
            display: inline-block;
            background-color: #f5f5f5;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            margin-right: 8px;
            margin-bottom: 8px;
            border-left: 3px solid ${MANDALA_GREEN};
        }
        .positive { color: #27a745; font-weight: 600; }
        .negative { color: #dc3545; font-weight: 600; }
        .neutral { color: #666; }
        .signal-box {
            background-color: ${MANDALA_SAGE};
            padding: 15px;
            border-radius: 6px;
            margin: 12px 0;
            border-left: 4px solid ${MANDALA_GREEN};
            font-size: 13px;
            line-height: 1.8;
        }
        .assessment-card {
            background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
            padding: 15px;
            border-radius: 6px;
            border-top: 4px solid ${MANDALA_GREEN};
            margin-bottom: 15px;
        }
        .assessment-card h4 {
            color: ${MANDALA_GREEN};
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 8px;
        }
        .assessment-card .value {
            font-size: 18px;
            font-weight: 600;
            color: ${MANDALA_GREEN};
            margin-bottom: 5px;
        }
        .assessment-card .reason {
            font-size: 12px;
            color: #666;
            line-height: 1.5;
        }
        .overall-assessment {
            text-align: center;
            margin-top: 25px;
            padding: 20px;
            background-color: ${MANDALA_SAGE};
            border-radius: 6px;
            border: 2px solid ${MANDALA_GREEN};
        }
        .overall-assessment h3 {
            color: ${MANDALA_GREEN};
            font-size: 18px;
            margin-bottom: 8px;
        }
        .overall-assessment .value {
            font-size: 24px;
            font-weight: 600;
            color: ${MANDALA_GREEN};
            margin-bottom: 8px;
        }
        .disclaimer {
            background-color: #f0f0f0;
            border-radius: 6px;
            padding: 15px;
            font-size: 11px;
            line-height: 1.7;
            color: #666;
            margin-top: 30px;
            font-style: italic;
        }
        .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        @media (max-width: 768px) {
            body { padding: 12px; }
            .section { padding: 18px; }
            header h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.report_title}</h1>
            <p class="subtitle">${formatDate(data.date)} · ${data.organization}</p>
            <p class="report-date">For personal investment awareness</p>
        </header>

        <div class="section">
            <h2>Executive Summary</h2>
            <ul class="bullet-list">
                ${data.executive_summary.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
        </div>

        <div class="section">
            <h2>Equities</h2>
            <div style="margin-bottom: 15px;">
                <div class="metric">SPY: $${data.equities.SPY.price} <span class="negative">${formatPercent(data.equities.SPY.change_percent)}</span></div>
                <div class="metric">QQQ: $${data.equities.QQQ.price} <span class="positive">${formatPercent(data.equities.QQQ.change_percent)}</span></div>
                <div class="metric">IWM: $${data.equities.IWM.price} <span class="neutral">Flat</span></div>
                <div class="metric">VIX: ${data.equities.VIX.level} <span class="neutral">${data.equities.VIX.signal}</span></div>
            </div>
            <div style="margin: 15px 0; font-size: 13px;">
                <p style="margin: 8px 0;"><strong>Strength:</strong> ${data.equities.sectors.strength}</p>
                <p style="margin: 8px 0;"><strong>Weakness:</strong> ${data.equities.sectors.weakness}</p>
            </div>
            <div class="signal-box">
                <strong>2-Sentence Synthesis:</strong> ${data.equities.synthesis}
            </div>
        </div>

        <div class="section">
            <h2>Fixed Income</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Treasury Yields</h4>
                    <p style="font-size: 13px;"><strong>10Y:</strong> ${data.fixed_income.treasury_10y.yield}%</p>
                    <p style="font-size: 13px;"><strong>2Y:</strong> ${data.fixed_income.treasury_2y.yield}%</p>
                    <p style="font-size: 13px;"><strong>Curve:</strong> <span class="positive">+${data.fixed_income.yield_curve_spread.bps} bps</span> (${data.fixed_income.yield_curve_spread.direction})</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Credit & Bonds</h4>
                    <p style="font-size: 13px;"><strong>HY Spreads:</strong> ${data.fixed_income.hy_spreads.bps} bps (${data.fixed_income.hy_spreads.signal})</p>
                    <p style="font-size: 13px;"><strong>TLT:</strong> $${data.fixed_income.TLT.price} <span class="negative">${formatPercent(data.fixed_income.TLT.change_percent)}</span></p>
                </div>
            </div>
            <div class="signal-box">
                <strong>2-Sentence Synthesis:</strong> ${data.fixed_income.synthesis}
            </div>
        </div>

        <div class="section">
            <h2>Commodities & Dollar</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Energy & Metals</h4>
                    <p style="font-size: 13px;"><strong>WTI:</strong> $${data.commodities.WTI_oil.price} <span class="positive">${formatPercent(data.commodities.WTI_oil.change_percent)}</span></p>
                    <p style="font-size: 13px;"><strong>Gold:</strong> ~$${data.commodities.gold.price} (${data.commodities.gold.signal})</p>
                    <p style="font-size: 13px;"><strong>Copper:</strong> >$${data.commodities.copper.price}/lb (${data.commodities.copper.signal})</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Dollar</h4>
                    <p style="font-size: 13px;"><strong>DXY:</strong> ${data.commodities.DXY.level} <span class="positive">${formatPercent(data.commodities.DXY.change_percent)}</span></p>
                    <p style="font-size: 12px; color: #666; margin-top: 8px;"><em>Slight strength; conflicting signals (higher rates vs. geopolitical risk flight-to-quality).</em></p>
                </div>
            </div>
            <div class="signal-box">
                <strong>1–2 Sentence Synthesis:</strong> ${data.commodities.synthesis}
            </div>
        </div>

        <div class="section">
            <h2>Macro Backdrop</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Monetary Policy</h4>
                    <p style="font-size: 13px;"><strong>Fed Funds Rate:</strong> ${data.macro.fed_funds_rate} (${data.macro.fed_stance})</p>
                    <p style="font-size: 12px; color: #666; margin-top: 8px;">Next FOMC: ${data.macro.next_fomc}</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid ${MANDALA_GREEN};">
                    <h4 style="color: ${MANDALA_GREEN}; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Inflation</h4>
                    <p style="font-size: 13px;"><strong>Latest CPI:</strong> ${data.macro.CPI.headline_yoy}% YoY (${data.macro.CPI.latest})</p>
                    <p style="font-size: 12px; color: #666; margin-top: 8px;">${data.macro.CPI.context}</p>
                </div>
            </div>
            <div class="signal-box">
                <strong>Macro Synthesis:</strong> ${data.macro.synthesis}
            </div>
        </div>

        <div class="section">
            <h2>Overall Condition Assessment</h2>
            <div class="assessment-card">
                <h4>Trend</h4>
                <div class="value">${data.assessment.trend}</div>
            </div>
            <div class="assessment-card">
                <h4>Breadth</h4>
                <div class="value">${data.assessment.breadth}</div>
            </div>
            <div class="assessment-card">
                <h4>Stress Level</h4>
                <div class="value">${data.assessment.stress_level}</div>
            </div>
            <div class="overall-assessment">
                <h3>Market Condition</h3>
                <div class="value">${data.assessment.overall_condition}</div>
            </div>
        </div>

        <div class="section">
            <h2>Watchpoints for Tomorrow</h2>
            <ul class="bullet-list">
                ${data.watchpoints.map(point => `<li>${point}</li>`).join('\n                ')}
            </ul>
        </div>

        <div class="disclaimer">
            <strong>Disclaimer:</strong> ${data.disclaimer}
        </div>

        <div class="footer">
            <p>${data.organization} · ${data.location}</p>
        </div>
    </div>
</body>
</html>`;

  return htmlContent;
}

// ============================================================================
// EMAIL GENERATOR
// ============================================================================
function generateEmail(data) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPercent = (val) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  const email = {
    to: ['andykannurpatti@gmail.com'],
    subject: `Daily Market Briefing — ${data.date} · Mandala`,
    htmlBody: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6;">
<div style="max-width: 700px; margin: 0 auto;">
<h2 style="color: ${MANDALA_GREEN}; margin-bottom: 20px;">Daily Market Briefing</h2>
<p><strong>${formatDate(data.date)}</strong></p>
<p>Your daily market report is ready. <strong>Market Condition: ${data.assessment.overall_condition}</strong></p>
<h3 style="color: ${MANDALA_GREEN}; margin-top: 25px; font-size: 16px;">Key Findings</h3>
<ul style="line-height: 1.9;">
  <li><strong>Equities:</strong> SPY ${formatPercent(data.equities.SPY.change_percent)} | QQQ ${formatPercent(data.equities.QQQ.change_percent)} | IWM Flat | VIX ${data.equities.VIX.level}</li>
  <li><strong>Fixed Income:</strong> 10Y ${data.fixed_income.treasury_10y.yield}% (${data.fixed_income.treasury_10y.context}) | 2Y ${data.fixed_income.treasury_2y.yield}% | TLT ${formatPercent(data.fixed_income.TLT.change_percent)}</li>
  <li><strong>Commodities:</strong> WTI ${formatPercent(data.commodities.WTI_oil.change_percent)} to $${data.commodities.WTI_oil.price} | Gold ~$${data.commodities.gold.price} | Copper >$${data.commodities.copper.price}/lb</li>
  <li><strong>Macro:</strong> Fed ${data.macro.fed_stance} ${data.macro.fed_funds_rate} | CPI ${data.macro.CPI.headline_yoy}% YoY | Jobless claims ${data.macro.jobless_claims.latest.toLocaleString()} | ISM PMI ${data.macro.ISM_PMI.latest}</li>
</ul>
<h3 style="color: ${MANDALA_GREEN}; margin-top: 25px; font-size: 16px;">Full Report</h3>
<p>View the complete daily briefing here:</p>
<p style="margin: 20px 0;"><a href="https://andykannurpatti.github.io/market-brief/" style="display: inline-block; background-color: ${MANDALA_GREEN}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">Open Daily Brief</a></p>
<p style="font-size: 13px; color: #666;">Live URL: <a href="https://andykannurpatti.github.io/market-brief/" style="color: ${MANDALA_GREEN};">https://andykannurpatti.github.io/market-brief/</a></p>
<p style="font-size: 13px; color: #666; margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd;">
<em>This report is for informational and educational purposes only. Past performance is not indicative of future results. Consult a qualified financial advisor before making investment decisions.</em>
</p>
<p style="font-size: 12px; color: #999; margin-top: 20px;">
${data.organization} · ${data.location}
</p>
</div>
</body></html>`
  };

  return email;
}

// ============================================================================
// MAIN
// ============================================================================
if (require.main === module) {
  const htmlOutput = generateHTML(data);
  const emailOutput = generateEmail(data);

  // Save HTML
  const htmlFileName = `DailyBrief_${data.date}.html`;
  fs.writeFileSync(htmlFileName, htmlOutput);
  console.log(`✓ HTML generated: ${htmlFileName}`);

  // Save email as JSON for reference
  const emailFileName = `email_${data.date}.json`;
  fs.writeFileSync(emailFileName, JSON.stringify(emailOutput, null, 2));
  console.log(`✓ Email draft template generated: ${emailFileName}`);

  // Also output the email object for piping to email tool
  console.log('EMAIL_PAYLOAD=' + JSON.stringify(emailOutput));
}

module.exports = { generateHTML, generateEmail };
