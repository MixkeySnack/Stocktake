require('dotenv').config();
const express = require('express');
const path = require('path');
const { LOCATIONS, SECTIONS } = require('./items');
const { readAllStock, updateItemQty, consumeItem, readUsageLog } = require('./sheets');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/config', (req, res) => {
  res.json({ locations: LOCATIONS, sections: SECTIONS });
});

// Returns current quantities for every location, read live from the Sheet.
app.get('/api/stock', async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID env var is not set');
    const stock = await readAllStock(SPREADSHEET_ID, LOCATIONS);
    res.json({ stock });
  } catch (err) {
    console.error('GET /api/stock failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Updates a single item's quantity in one location, writing straight to the Sheet.
app.post('/api/stock/update', async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID env var is not set');
    const { location, itemId, qty } = req.body || {};
    if (!location || !itemId || typeof qty !== 'number' || qty < 0) {
      return res.status(400).json({ error: 'location, itemId, and a non-negative numeric qty are required' });
    }
    if (!LOCATIONS.includes(location)) {
      return res.status(400).json({ error: `Unknown location "${location}". Expected one of: ${LOCATIONS.join(', ')}` });
    }
    const result = await updateItemQty(SPREADSHEET_ID, location, itemId, qty);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    console.error('POST /api/stock/update failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Records daily usage: subtracts qty from stock and appends a row to the UsageLog tab.
// body: { location, date, entries: [{ itemId, qty }] }
app.post('/api/usage', async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID env var is not set');
    const { location, date, entries } = req.body || {};
    if (!location || !date || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'location, date, and a non-empty entries array are required' });
    }
    if (!LOCATIONS.includes(location)) {
      return res.status(400).json({ error: `Unknown location "${location}". Expected one of: ${LOCATIONS.join(', ')}` });
    }
    const results = [];
    for (const entry of entries) {
      const qtyUsed = Number(entry.qty);
      if (!entry.itemId || !(qtyUsed > 0)) continue;
      const newQty = await consumeItem(SPREADSHEET_ID, location, entry.itemId, date, qtyUsed);
      results.push({ itemId: entry.itemId, newQty });
    }
    res.json({ status: 'ok', updated: results });
  } catch (err) {
    console.error('POST /api/usage failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Returns usage history for one location.
app.get('/api/usage', async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID env var is not set');
    const location = req.query.location;
    if (!location || !LOCATIONS.includes(location)) {
      return res.status(400).json({ error: `location query param must be one of: ${LOCATIONS.join(', ')}` });
    }
    const log = await readUsageLog(SPREADSHEET_ID, location);
    res.json({ log });
  } catch (err) {
    console.error('GET /api/usage failed', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stock sync server running on port ${PORT}`);
});
