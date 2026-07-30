<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>คลังวัตถุดิบ — Live Sync</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
  :root {
    --bg: #F7F3EA; --surface: #FFFFFF; --ink: #2B2118; --ink-soft: #6B5D4F;
    --line: #E4DCC9; --coffee: #5B3A24; --coffee-dark: #3E2717;
    --sage: #7C8B5F; --alert: #B54A2C; --alert-bg: #F6E1D6;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Work Sans', sans-serif; background: var(--bg); color: var(--ink); padding: 28px 20px 60px; }
  h1 { font-family: 'Fraunces', serif; font-size: 28px; color: var(--coffee-dark); margin: 0 0 4px; }
  .sub { font-size: 13px; color: var(--ink-soft); margin-bottom: 20px; }
  .wrap { max-width: 960px; margin: 0 auto; }
  .top-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
  .loc-switch, .tab-switch { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px; width: fit-content; }
  .loc-btn, .tab-btn { border: none; background: none; padding: 7px 18px; border-radius: 999px; font-family: 'IBM Plex Mono'; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--ink-soft); }
  .loc-btn.active, .tab-btn.active { background: var(--coffee); color: #fff; }
  .status-bar { font-size: 12px; color: var(--ink-soft); margin-bottom: 16px; }
  .status-bar.error { color: var(--alert); }
  .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--coffee-dark); margin: 24px 0 10px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
  .card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px; }
  .card.low { border-color: var(--alert); background: linear-gradient(180deg, var(--alert-bg), var(--surface) 45%); }
  .code { font-family: 'IBM Plex Mono'; font-size: 11px; color: var(--ink-soft); }
  .name { font-size: 15px; font-weight: 600; margin: 2px 0 8px; }
  .qty-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 10px; }
  .qty { font-family: 'IBM Plex Mono'; font-size: 24px; font-weight: 600; color: var(--coffee-dark); }
  .card.low .qty { color: var(--alert); }
  .unit { font-size: 12px; color: var(--ink-soft); }
  .controls { display: flex; align-items: center; gap: 6px; }
  .btn { width: 26px; height: 26px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); cursor: pointer; font-size: 15px; font-weight: 600; color: var(--coffee-dark); }
  .btn:hover { background: var(--line); }
  .amt { width: 58px; text-align: center; border: 1px solid var(--line); border-radius: 8px; padding: 5px 2px; font-family: 'IBM Plex Mono'; font-size: 12px; }
  .btn-set { color: #5F6D46; border-color: var(--sage); }
  .btn-set:hover { background: var(--sage); color: #fff; }
  .saving-tag { font-size: 10px; color: var(--sage); margin-top: 6px; visibility: hidden; }
  .saving-tag.show { visibility: visible; }

  .date-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .date-row input[type="date"] { border: 1px solid var(--line); border-radius: 8px; padding: 7px 10px; font-family: 'Work Sans'; font-size: 13px; background: var(--surface); }
  .usage-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 4px; border-bottom: 1px solid var(--line); gap: 10px; }
  .usage-row:last-child { border-bottom: none; }
  .usage-name { font-size: 13.5px; }
  .usage-name span { color: var(--ink-soft); font-size: 11.5px; margin-left: 6px; font-family: 'IBM Plex Mono'; }
  .usage-input { width: 70px; text-align: center; border: 1px solid var(--line); border-radius: 8px; padding: 6px; font-family: 'IBM Plex Mono'; font-size: 13px; }
  .primary-btn { background: var(--coffee); color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: 'Work Sans'; }
  .primary-btn:hover { background: var(--coffee-dark); }
  .submit-bar { display: flex; justify-content: flex-end; margin: 14px 0 30px; }
  .history { border-top: 1px solid var(--line); padding-top: 16px; }
  .history h2 { font-family: 'Fraunces', serif; font-size: 17px; color: var(--coffee-dark); margin: 0 0 12px; }
  .log-day { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; margin-bottom: 10px; }
  .log-date { font-weight: 700; font-size: 13.5px; margin-bottom: 6px; color: var(--coffee-dark); }
  .log-items { font-size: 12.5px; color: var(--ink-soft); }
  .log-items b { color: var(--ink); font-family: 'IBM Plex Mono'; font-weight: 600; }
  .empty { color: var(--ink-soft); font-size: 13px; padding: 10px 4px; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>คลังวัตถุดิบ</h1>
    <div class="sub">แก้ตัวเลขที่นี่ = อัปเดตเข้า Google Sheet ทันที (ไม่ต้อง export/sync เอง)</div>
    <div class="top-row">
      <div id="locSwitch" class="loc-switch"></div>
      <div class="tab-switch">
        <button class="tab-btn" id="tabStock" onclick="switchView('stock')">สต๊อก</button>
        <button class="tab-btn" id="tabUsage" onclick="switchView('usage')">การใช้ประจำวัน</button>
      </div>
    </div>
    <div id="statusBar" class="status-bar">กำลังโหลด…</div>
    <div id="app"></div>
  </div>

<script>
  let CONFIG = null;      // { locations, sections }
  let STOCK = null;       // { QLD: { B1: 12, ... }, WA: {...}, SA: {...} }
  let currentLocation = null;
  let currentView = 'stock'; // 'stock' | 'usage'
  let usageDate = new Date().toISOString().slice(0, 10);
  let usageDraft = {};
  let usageLog = [];

  const statusBar = document.getElementById('statusBar');
  const locSwitchEl = document.getElementById('locSwitch');
  const appEl = document.getElementById('app');

  function setStatus(text, isError) {
    statusBar.textContent = text;
    statusBar.className = 'status-bar' + (isError ? ' error' : '');
  }

  async function loadConfig() {
    const res = await fetch('/api/config');
    CONFIG = await res.json();
    currentLocation = CONFIG.locations[0];
  }

  async function loadStock() {
    setStatus('กำลังโหลดข้อมูลจากชีต…');
    const res = await fetch('/api/stock');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus('โหลดข้อมูลไม่สำเร็จ: ' + (err.error || res.statusText), true);
      return;
    }
    const data = await res.json();
    STOCK = data.stock;
    setStatus('ข้อมูลล่าสุดจาก Google Sheet');
  }

  async function loadUsageLog() {
    const res = await fetch('/api/usage?location=' + encodeURIComponent(currentLocation));
    if (!res.ok) { usageLog = []; return; }
    const data = await res.json();
    usageLog = data.log || [];
  }

  async function updateQty(itemId, qty) {
    const card = document.querySelector(`[data-item="${itemId}"] .saving-tag`);
    if (card) card.classList.add('show');
    try {
      const res = await fetch('/api/stock/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: currentLocation, itemId, qty }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      STOCK[currentLocation][itemId] = qty;
      setStatus('บันทึกเข้า Google Sheet แล้ว ✓');
    } catch (e) {
      setStatus('บันทึกไม่สำเร็จ: ' + e.message, true);
    }
    if (card) card.classList.remove('show');
    render();
  }

  window.onAdjust = function (itemId, delta) {
    const amtInput = document.getElementById('amt-' + itemId);
    let amt = amtInput ? parseFloat(amtInput.value) : NaN;
    if (isNaN(amt) || amt <= 0) amt = 1;
    const current = STOCK[currentLocation][itemId] || 0;
    const next = Math.max(0, current + delta * amt);
    updateQty(itemId, next);
  };

  window.onSetQty = function (itemId) {
    const amtInput = document.getElementById('amt-' + itemId);
    const val = amtInput ? parseFloat(amtInput.value) : NaN;
    if (isNaN(val) || val < 0) { alert('กรุณาใส่จำนวนที่ถูกต้องก่อนกดบันทึก'); return; }
    updateQty(itemId, val);
  };

  window.onAmtKeydown = function (itemId, ev) {
    if (ev.key === 'Enter') { ev.preventDefault(); onSetQty(itemId); }
  };

  window.switchLocation = async function (loc) {
    currentLocation = loc;
    usageDraft = {};
    if (currentView === 'usage') await loadUsageLog();
    render();
  };

  window.switchView = async function (view) {
    currentView = view;
    if (view === 'usage') { setStatus('กำลังโหลดประวัติ…'); await loadUsageLog(); setStatus('พร้อมใช้งาน'); }
    render();
  };

  window.onUsageInput = function (itemId, val) {
    usageDraft[itemId] = val;
  };

  window.onSetUsageDate = function (val) {
    usageDate = val;
    render();
  };

  window.onSubmitUsage = async function () {
    const entries = [];
    Object.keys(usageDraft).forEach(itemId => {
      const qty = parseFloat(usageDraft[itemId]);
      if (qty > 0) entries.push({ itemId, qty });
    });
    if (entries.length === 0) { alert('กรุณากรอกจำนวนที่ใช้อย่างน้อย 1 รายการ'); return; }
    setStatus('กำลังบันทึกการใช้งาน…');
    try {
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: currentLocation, date: usageDate, entries }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      const data = await res.json();
      data.updated.forEach(u => { STOCK[currentLocation][u.itemId] = u.newQty; });
      usageDraft = {};
      await loadUsageLog();
      setStatus('บันทึกการใช้งานเข้า Google Sheet แล้ว ✓');
    } catch (e) {
      setStatus('บันทึกไม่สำเร็จ: ' + e.message, true);
    }
    render();
  };

  function renderStockView() {
    const qtyMap = STOCK[currentLocation] || {};
    return CONFIG.sections.map(sec => `
      <div class="section-title">${sec.label}</div>
      <div class="grid">
        ${sec.items.map(item => {
          const qty = qtyMap[item.id] ?? 0;
          const isLow = qty <= item.par;
          return `
            <div class="card ${isLow ? 'low' : ''}" data-item="${item.id}">
              <div class="code">${item.id}</div>
              <div class="name">${item.name}</div>
              <div class="qty-row"><span class="qty">${qty}</span><span class="unit">${item.unit}</span></div>
              <div class="controls">
                <button class="btn" onclick="onAdjust('${item.id}', -1)">−</button>
                <input class="amt" id="amt-${item.id}" type="number" min="0" step="any" placeholder="จำนวน" onkeydown="onAmtKeydown('${item.id}', event)" />
                <button class="btn" onclick="onAdjust('${item.id}', 1)">+</button>
                <button class="btn btn-set" onclick="onSetQty('${item.id}')" title="ตั้งยอดคงเหลือเป็นเลขนี้โดยตรง">✓</button>
              </div>
              <div class="saving-tag">กำลังบันทึก…</div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');
  }

  function todayLabel(d) {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return d; }
  }

  function renderUsageView() {
    const qtyMap = STOCK[currentLocation] || {};
    const sectionsHtml = CONFIG.sections.map(sec => `
      <div class="section-title">${sec.label}</div>
      ${sec.items.map(item => `
        <div class="usage-row">
          <div class="usage-name">${item.name} <span>${item.id} · คงเหลือ ${qtyMap[item.id] ?? 0} ${item.unit}</span></div>
          <input class="usage-input" type="number" min="0" step="any" placeholder="0"
            value="${usageDraft[item.id] || ''}" oninput="onUsageInput('${item.id}', this.value)" />
        </div>
      `).join('')}
    `).join('');

    const logHtml = usageLog.length === 0
      ? `<div class="empty">ยังไม่มีประวัติการบันทึกการใช้งานของสาขา ${currentLocation}</div>`
      : usageLog.slice(0, 30).map(rec => `
          <div class="log-day">
            <div class="log-date">${todayLabel(rec.date)}</div>
            <div class="log-items">${rec.itemName} <b>${rec.qtyUsed}</b> ${rec.unit}</div>
          </div>
        `).join('');

    return `
      <div class="date-row">
        <label style="font-size:13px; color:var(--ink-soft);">วันที่ใช้งาน:</label>
        <input type="date" value="${usageDate}" onchange="onSetUsageDate(this.value)" />
      </div>
      ${sectionsHtml}
      <div class="submit-bar">
        <button class="primary-btn" onclick="onSubmitUsage()">บันทึกการใช้งานวันนี้</button>
      </div>
      <div class="history">
        <h2>ประวัติการใช้งานย้อนหลัง — ${currentLocation}</h2>
        ${logHtml}
      </div>
    `;
  }

  function render() {
    locSwitchEl.innerHTML = CONFIG.locations.map(loc =>
      `<button class="loc-btn ${loc === currentLocation ? 'active' : ''}" onclick="switchLocation('${loc}')">${loc}</button>`
    ).join('');
    document.getElementById('tabStock').className = 'tab-btn' + (currentView === 'stock' ? ' active' : '');
    document.getElementById('tabUsage').className = 'tab-btn' + (currentView === 'usage' ? ' active' : '');

    appEl.innerHTML = currentView === 'usage' ? renderUsageView() : renderStockView();
  }

  (async function init() {
    await loadConfig();
    await loadStock();
    render();
  })();
</script>
</body>
</html>
