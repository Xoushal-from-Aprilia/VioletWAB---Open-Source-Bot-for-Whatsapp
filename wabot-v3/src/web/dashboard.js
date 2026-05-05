export function getDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VioletWAB — Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0a0a0f;
  --surface: #12121a;
  --surface2: #1a1a26;
  --border: #1e1e2e;
  --violet: #7c3aed;
  --violet-glow: #a855f7;
  --green: #10b981;
  --red: #ef4444;
  --yellow: #f59e0b;
  --text: #e2e8f0;
  --muted: #64748b;
  --sidebar-w: 240px;
}
body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; display: flex; }

/* ── Sidebar ── */
.sidebar {
  width: var(--sidebar-w); min-height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  position: fixed; left: 0; top: 0; bottom: 0;
  z-index: 10;
}
.sidebar-logo {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--violet), var(--violet-glow)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.logo-text { font-size: 16px; font-weight: 800; }
.logo-text span { color: var(--violet-glow); }
.nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  cursor: pointer; font-size: 14px; font-weight: 600;
  color: var(--muted); transition: all 0.15s;
  border: none; background: none; width: 100%; text-align: left;
}
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item.active { background: rgba(124,58,237,0.15); color: var(--violet-glow); }
.nav-item .icon { font-size: 18px; flex-shrink: 0; }
.status-badge {
  margin: 16px 12px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-family: 'DM Mono', monospace;
  display: flex; align-items: center; gap: 8px;
}
.status-badge.online { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: var(--green); }
.status-badge.offline { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--red); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.dot.pulse { animation: blink 1.5s infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.logout-btn {
  margin: 12px; padding: 10px 12px;
  background: none; border: 1px solid var(--border);
  border-radius: 10px; color: var(--muted);
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.logout-btn:hover { border-color: var(--red); color: var(--red); }

/* ── Main ── */
.main { margin-left: var(--sidebar-w); flex: 1; padding: 32px; min-height: 100vh; }
.page { display: none; }
.page.active { display: block; }
.page-title { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
.page-sub { color: var(--muted); font-size: 13px; font-family: 'DM Mono', monospace; margin-bottom: 32px; }

/* ── Cards ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 20px;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: var(--violet); }
.stat-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.stat-value { font-size: 28px; font-weight: 800; font-family: 'DM Mono', monospace; }
.stat-value.green { color: var(--green); }
.stat-value.violet { color: var(--violet-glow); }
.stat-value.yellow { color: var(--yellow); }

.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 24px; margin-bottom: 20px;
}
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

/* ── QR ── */
.qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px; }
.qr-wrap img { border-radius: 12px; border: 4px solid var(--violet); width: 220px; height: 220px; }
.qr-placeholder { width: 220px; height: 220px; border: 2px dashed var(--border); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--muted); font-size: 13px; }

/* ── Inputs ── */
input[type=text], input[type=password], textarea, select {
  width: 100%; background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 14px;
  color: var(--text); font-family: 'DM Mono', monospace; font-size: 14px;
  outline: none; transition: border-color 0.2s;
}
input:focus, textarea:focus, select:focus { border-color: var(--violet); }
textarea { resize: vertical; min-height: 100px; }
.form-group { margin-bottom: 14px; }
.form-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }

/* ── Buttons ── */
.btn {
  padding: 10px 20px; border-radius: 10px; border: none;
  font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary { background: linear-gradient(135deg, var(--violet), var(--violet-glow)); color: white; }
.btn-primary:hover { opacity: 0.85; }
.btn-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--red); }
.btn-danger:hover { background: rgba(239,68,68,0.25); }
.btn-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--green); }
.btn-success:hover { background: rgba(16,185,129,0.25); }
.btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

/* ── Tables ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); padding: 8px 12px; border-bottom: 1px solid var(--border); }
td { padding: 12px; border-bottom: 1px solid rgba(30,30,46,0.5); font-size: 13px; font-family: 'DM Mono', monospace; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--surface2); }

/* ── Logs ── */
.log-list { display: flex; flex-direction: column; gap: 4px; max-height: 400px; overflow-y: auto; }
.log-entry {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 8px 12px; border-radius: 8px;
  font-family: 'DM Mono', monospace; font-size: 12px;
  background: var(--surface2);
}
.log-time { color: var(--muted); flex-shrink: 0; }
.log-msg { flex: 1; }
.log-entry.success .log-msg { color: var(--green); }
.log-entry.warn .log-msg { color: var(--yellow); }
.log-entry.error .log-msg { color: var(--red); }

/* ── Admin list ── */
.admin-list { display: flex; flex-direction: column; gap: 8px; }
.admin-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background: var(--surface2);
  border-radius: 10px; border: 1px solid var(--border);
}
.admin-jid { font-family: 'DM Mono', monospace; font-size: 13px; }
.founder-badge {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white; font-size: 10px; font-weight: 700;
  padding: 3px 8px; border-radius: 20px; letter-spacing: 0.5px;
}

/* ── Group list ── */
.group-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; background: var(--surface2);
  border-radius: 10px; border: 1px solid var(--border);
  margin-bottom: 8px;
}
.group-name { font-weight: 700; font-size: 14px; }
.group-id { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
.group-actions { display: flex; gap: 6px; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 20px;
  font-size: 14px; z-index: 999;
  transform: translateY(80px); opacity: 0;
  transition: all 0.3s; pointer-events: none;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast.success { border-color: rgba(16,185,129,0.4); color: var(--green); }
.toast.error { border-color: rgba(239,68,68,0.4); color: var(--red); }
</style>
</head>
<body>

<!-- Sidebar -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <div class="logo-icon">🤖</div>
    <div class="logo-text">Violet<span>WAB</span></div>
  </div>
  <nav class="nav">
    <button class="nav-item active" onclick="showPage('dashboard')"><span class="icon">📊</span> Dashboard</button>
    <button class="nav-item" onclick="showPage('gruppi')"><span class="icon">👥</span> Gruppi</button>
    <button class="nav-item" onclick="showPage('messaggi')"><span class="icon">💬</span> Messaggi</button>
    <button class="nav-item" onclick="showPage('admin')"><span class="icon">🛡️</span> Admin Bot</button>
    <button class="nav-item" onclick="showPage('warn')"><span class="icon">⚠️</span> Warn</button>
    <button class="nav-item" onclick="showPage('log')"><span class="icon">📋</span> Log</button>
  </nav>
  <div id="statusBadge" class="status-badge offline">
    <span class="dot"></span> <span id="statusText">Disconnesso</span>
  </div>
  <button class="logout-btn" onclick="location.href='/logout'">⏻ Logout</button>
</aside>

<!-- Main -->
<main class="main">

  <!-- Dashboard -->
  <div id="page-dashboard" class="page active">
    <div class="page-title">Dashboard</div>
    <div class="page-sub">// panoramica sistema</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Messaggi</div><div class="stat-value violet" id="statMsg">—</div></div>
      <div class="stat-card"><div class="stat-label">Comandi</div><div class="stat-value violet" id="statCmd">—</div></div>
      <div class="stat-card"><div class="stat-label">Gruppi</div><div class="stat-value yellow" id="statGroups">—</div></div>
      <div class="stat-card"><div class="stat-label">RAM</div><div class="stat-value" id="statRam">—</div></div>
      <div class="stat-card"><div class="stat-label">Uptime</div><div class="stat-value green" id="statUptime">—</div></div>
    </div>
    <div class="card">
      <div class="card-title">📱 Stato connessione WhatsApp</div>
      <div class="qr-wrap">
        <div id="qrContainer">
          <div class="qr-placeholder">✅<span id="qrStatus">In attesa...</span></div>
        </div>
        <div id="qrMsg" style="color:var(--muted);font-size:13px;font-family:'DM Mono',monospace;"></div>
      </div>
    </div>
  </div>

  <!-- Gruppi -->
  <div id="page-gruppi" class="page">
    <div class="page-title">Gruppi</div>
    <div class="page-sub">// gestisci i gruppi dove sei presente</div>
    <div class="card">
      <div class="card-title">👥 Gruppi attivi</div>
      <div id="groupList"><p style="color:var(--muted);font-size:13px">Caricamento...</p></div>
    </div>
  </div>

  <!-- Messaggi -->
  <div id="page-messaggi" class="page">
    <div class="page-title">Messaggi</div>
    <div class="page-sub">// invia messaggi e broadcast</div>
    <div class="card">
      <div class="card-title">💬 Invia messaggio a un gruppo</div>
      <div class="form-group"><label class="form-label">JID Gruppo</label><input type="text" id="sendJid" placeholder="120363...@g.us"></div>
      <div class="form-group"><label class="form-label">Messaggio</label><textarea id="sendMsg" placeholder="Scrivi qui..."></textarea></div>
      <button class="btn btn-primary" onclick="sendMsg()">✉️ Invia</button>
    </div>
    <div class="card">
      <div class="card-title">📢 Broadcast a tutti i gruppi</div>
      <div class="form-group"><label class="form-label">Messaggio</label><textarea id="broadcastMsg" placeholder="Messaggio da inviare a tutti i gruppi..."></textarea></div>
      <button class="btn btn-primary" onclick="sendBroadcast()">📢 Invia a tutti</button>
    </div>
  </div>

  <!-- Admin -->
  <div id="page-admin" class="page">
    <div class="page-title">Admin Bot</div>
    <div class="page-sub">// gestisci i moderatori del bot</div>
    <div class="card">
      <div class="card-title">➕ Aggiungi Admin</div>
      <div style="display:flex;gap:10px">
        <input type="text" id="newAdminJid" placeholder="JID utente (es: 3934...@lid)" style="flex:1">
        <button class="btn btn-primary" onclick="addAdmin()">Aggiungi</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">🛡️ Lista Admin</div>
      <div class="admin-list" id="adminList">Caricamento...</div>
    </div>
  </div>

  <!-- Warn -->
  <div id="page-warn" class="page">
    <div class="page-title">Warn</div>
    <div class="page-sub">// avvertimenti degli utenti</div>
    <div class="card">
      <div class="card-title">⚠️ Avvertimenti attivi</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Utente</th><th>Gruppo</th><th>Warn</th><th>Azione</th></tr></thead>
          <tbody id="warnTable"><tr><td colspan="4" style="color:var(--muted)">Caricamento...</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Log -->
  <div id="page-log" class="page">
    <div class="page-title">Log</div>
    <div class="page-sub">// attività in tempo reale</div>
    <div class="card">
      <div class="card-title">📋 Log attività <span style="color:var(--green);font-size:11px;font-family:'DM Mono',monospace">● LIVE</span></div>
      <div class="log-list" id="logList"></div>
    </div>
  </div>

</main>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ── Nav ──────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  event.currentTarget.classList.add('active');
  if (id === 'gruppi') loadGroups();
  if (id === 'admin') loadAdmins();
  if (id === 'warn') loadWarns();
  if (id === 'log') loadLogs();
}

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Fetch status ─────────────────────────────────────────────
async function fetchStatus() {
  try {
    const r = await fetch('/api/status');
    const d = await r.json();
    updateUI(d);
  } catch {}
}

function formatUptime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h + 'h ' + m + 'm';
}

function formatMem(bytes) {
  return (bytes / 1024 / 1024).toFixed(0) + ' MB';
}

function updateUI(d) {
  document.getElementById('statMsg').textContent = d.messagesReceived;
  document.getElementById('statCmd').textContent = d.commandsExecuted;
  document.getElementById('statGroups').textContent = d.groups?.length || 0;
  document.getElementById('statRam').textContent = formatMem(d.memory);
  document.getElementById('statUptime').textContent = formatUptime(d.uptime);

  const badge = document.getElementById('statusBadge');
  const dot = badge.querySelector('.dot');
  const txt = document.getElementById('statusText');

  if (d.connected) {
    badge.className = 'status-badge online';
    dot.className = 'dot pulse';
    txt.textContent = 'Online';
    document.getElementById('qrContainer').innerHTML = '<div class="qr-placeholder">✅<span>Bot connesso!</span></div>';
    document.getElementById('qrMsg').textContent = 'WhatsApp collegato correttamente';
  } else if (d.qrCode) {
    badge.className = 'status-badge offline';
    dot.className = 'dot';
    txt.textContent = 'In attesa QR';
    document.getElementById('qrContainer').innerHTML = '<img src="' + d.qrCode + '" alt="QR Code">';
    document.getElementById('qrMsg').textContent = 'Scansiona con WhatsApp → Dispositivi collegati';
  } else {
    badge.className = 'status-badge offline';
    dot.className = 'dot';
    txt.textContent = 'Disconnesso';
    document.getElementById('qrStatus').textContent = 'In attesa del QR...';
  }
}

// ── Gruppi ───────────────────────────────────────────────────
async function loadGroups() {
  const r = await fetch('/api/status');
  const d = await r.json();
  const el = document.getElementById('groupList');
  if (!d.groups?.length) { el.innerHTML = '<p style="color:var(--muted);font-size:13px">Nessun gruppo trovato.</p>'; return; }
  el.innerHTML = d.groups.map(g => \`
    <div class="group-item">
      <div>
        <div class="group-name">\${g.name}</div>
        <div class="group-id">\${g.id} · \${g.participants} membri</div>
      </div>
      <div class="group-actions">
        <button class="btn btn-sm btn-danger" onclick="muteGroup('\${g.id}','mute')">🔇 Muta</button>
        <button class="btn btn-sm btn-success" onclick="muteGroup('\${g.id}','unmute')">🔊 Apri</button>
      </div>
    </div>
  \`).join('');
}

async function muteGroup(jid, action) {
  const r = await fetch('/api/mute', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jid, action}) });
  const d = await r.json();
  toast(d.ok ? (action === 'mute' ? '🔇 Gruppo silenziato' : '🔊 Gruppo riaperto') : '❌ ' + d.error, d.ok ? 'success' : 'error');
}

// ── Messaggi ─────────────────────────────────────────────────
async function sendMsg() {
  const jid = document.getElementById('sendJid').value;
  const message = document.getElementById('sendMsg').value;
  if (!jid || !message) return toast('Compila tutti i campi', 'error');
  const r = await fetch('/api/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jid, message}) });
  const d = await r.json();
  toast(d.ok ? '✅ Messaggio inviato!' : '❌ ' + d.error, d.ok ? 'success' : 'error');
  if (d.ok) document.getElementById('sendMsg').value = '';
}

async function sendBroadcast() {
  const message = document.getElementById('broadcastMsg').value;
  if (!message) return toast('Scrivi un messaggio', 'error');
  if (!confirm('Inviare a tutti i gruppi?')) return;
  const r = await fetch('/api/broadcast', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message}) });
  const d = await r.json();
  toast(d.ok ? '📢 Inviato a ' + d.sent + ' gruppi!' : '❌ ' + d.error, d.ok ? 'success' : 'error');
}

// ── Admin ────────────────────────────────────────────────────
async function loadAdmins() {
  const r = await fetch('/api/status');
  const d = await r.json();
  const el = document.getElementById('adminList');
  const items = [];
  items.push(\`<div class="admin-item"><div><span class="admin-jid">@\${d.founder?.split('@')[0]}</span></div><span class="founder-badge">👑 FONDATORE</span></div>\`);
  for (const a of (d.admins || [])) {
    items.push(\`<div class="admin-item"><span class="admin-jid">@\${a.split('@')[0]}</span><button class="btn btn-sm btn-danger" onclick="removeAdmin('\${a}')">Rimuovi</button></div>\`);
  }
  el.innerHTML = items.join('') || '<p style="color:var(--muted)">Nessun admin.</p>';
}

async function addAdmin() {
  const jid = document.getElementById('newAdminJid').value.trim();
  if (!jid) return toast('Inserisci un JID', 'error');
  const r = await fetch('/api/admins/add', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jid}) });
  const d = await r.json();
  toast(d.ok ? '✅ Admin aggiunto!' : 'ℹ️ Già admin', d.ok ? 'success' : 'error');
  document.getElementById('newAdminJid').value = '';
  loadAdmins();
}

async function removeAdmin(jid) {
  const r = await fetch('/api/admins/remove', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jid}) });
  const d = await r.json();
  toast(d.ok ? '✅ Admin rimosso' : '❌ ' + d.error, d.ok ? 'success' : 'error');
  loadAdmins();
}

// ── Warn ─────────────────────────────────────────────────────
async function loadWarns() {
  const r = await fetch('/api/warns');
  const d = await r.json();
  const tbody = document.getElementById('warnTable');
  const entries = Object.entries(d).filter(([,v]) => v > 0);
  if (!entries.length) { tbody.innerHTML = '<tr><td colspan="4" style="color:var(--muted)">Nessun warn attivo.</td></tr>'; return; }
  tbody.innerHTML = entries.map(([key, count]) => {
    const [group, user] = key.split(':');
    return \`<tr>
      <td>@\${user?.split('@')[0] || user}</td>
      <td style="color:var(--muted)">\${group?.split('@')[0]}</td>
      <td><span style="color:\${count >= 2 ? 'var(--red)' : 'var(--yellow)'}; font-weight:700">\${count}/3</span></td>
      <td><button class="btn btn-sm btn-success" onclick="clearWarn('\${key}')">Azzera</button></td>
    </tr>\`;
  }).join('');
}

async function clearWarn(key) {
  await fetch('/api/warns/clear', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key}) });
  toast('✅ Warn azzerato'); loadWarns();
}

// ── Log ──────────────────────────────────────────────────────
function renderLogs(logs) {
  const el = document.getElementById('logList');
  if (!logs?.length) { el.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px">Nessun log.</div>'; return; }
  el.innerHTML = logs.map(l => \`
    <div class="log-entry \${l.level}">
      <span class="log-time">\${new Date(l.time).toLocaleTimeString()}</span>
      <span class="log-msg">\${l.message}</span>
    </div>
  \`).join('');
}

async function loadLogs() {
  const r = await fetch('/api/status');
  const d = await r.json();
  renderLogs(d.logs);
}

// ── WebSocket live ───────────────────────────────────────────
function connectWS() {
  const ws = new WebSocket('ws://' + location.host);
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'status' || msg.type === 'qr') fetchStatus();
    if (msg.type === 'log') {
      const el = document.getElementById('logList');
      const div = document.createElement('div');
      div.className = 'log-entry ' + (msg.data.level || 'info');
      div.innerHTML = \`<span class="log-time">\${new Date(msg.data.time).toLocaleTimeString()}</span><span class="log-msg">\${msg.data.message}</span>\`;
      el.prepend(div);
    }
  };
  ws.onclose = () => setTimeout(connectWS, 3000);
}

// ── Init ─────────────────────────────────────────────────────
fetchStatus();
setInterval(fetchStatus, 10000);
connectWS();
</script>
</body>
</html>`;
}
