require('dotenv').config();
const express = require('express');
const path = require('path');
const { LOCATIONS, SECTIONS } = require('./items');
const { readAllStock, updateItemQty } = require('./sheets');

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stock sync server running on port ${PORT}`);
});
