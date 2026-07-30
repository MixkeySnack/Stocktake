const { google } = require('googleapis');
const { flatItems } = require('./items');

let sheetsClientPromise = null;

function getSheetsClient() {
  if (!sheetsClientPromise) {
    const rawCreds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!rawCreds) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is not set');
    }
    const credentials = JSON.parse(rawCreds);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheetsClientPromise = auth.getClient().then(authClient =>
      google.sheets({ version: 'v4', auth: authClient })
    );
  }
  return sheetsClientPromise;
}

function codeFromCell(text) {
  const m = String(text || '').match(/^\s*([A-Za-z0-9]+)\s*:/);
  return m ? m[1].toUpperCase() : null;
}

// Reads column A of one tab and returns { [itemCode]: { row, qty } }
async function readTabRows(sheets, spreadsheetId, tabName) {
  const range = `'${tabName}'!A1:A500`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  const byCode = {};
  rows.forEach((row, idx) => {
    const text = row[0] || '';
    const code = codeFromCell(text);
    if (!code) return;
    const qtyMatch = String(text).match(/=\s*([\d.]+)/);
    byCode[code] = {
      row: idx + 1, // 1-indexed sheet row
      qty: qtyMatch ? parseFloat(qtyMatch[1]) : 0,
    };
  });
  return byCode;
}

// Returns { QLD: { B1: 12, C1: 4, ... }, WA: {...}, SA: {...} }
async function readAllStock(spreadsheetId, locations) {
  const sheets = await getSheetsClient();
  const result = {};
  for (const loc of locations) {
    const byCode = await readTabRows(sheets, spreadsheetId, loc);
    const qtyMap = {};
    Object.keys(byCode).forEach(code => { qtyMap[code] = byCode[code].qty; });
    result[loc] = qtyMap;
  }
  return result;
}

// Updates one item's quantity in one location's tab.
async function updateItemQty(spreadsheetId, location, itemId, qty) {
  const sheets = await getSheetsClient();
  const byCode = await readTabRows(sheets, spreadsheetId, location);
  const entry = byCode[itemId.toUpperCase()];
  if (!entry) {
    throw new Error(`Item ${itemId} not found in sheet tab "${location}"`);
  }
  const item = flatItems().find(i => i.id.toUpperCase() === itemId.toUpperCase());
  const name = item ? item.name : itemId;
  const unit = item ? item.unit : '';

  const cellText = `${itemId} : ${name} = ${qty} ${unit}`;
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        { range: `'${location}'!A${entry.row}`, values: [[cellText]] },
        { range: `'${location}'!B${entry.row}`, values: [[qty]] },
      ],
    },
  });
  return { row: entry.row };
}

module.exports = { readAllStock, updateItemQty };
