export function getLoginHTML(error = "") {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VioletWAB — Login</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --border: #1e1e2e;
    --violet: #7c3aed;
    --violet-glow: #a855f7;
    --green: #10b981;
    --text: #e2e8f0;
    --muted: #64748b;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .bg-grid {
    position: fixed; inset: 0; z-index: 0;
    background-image: 
      linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .glow-orb {
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    animation: pulse 4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  }
  .card {
    position: relative; z-index: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px 40px;
    width: 100%; max-width: 400px;
    box-shadow: 0 0 60px rgba(124,58,237,0.15);
    animation: slideUp 0.5s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 32px;
  }
  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--violet), var(--violet-glow));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .logo-text { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-text span { color: var(--violet-glow); }
  h1 { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
  .subtitle { color: var(--muted); font-size: 14px; margin-bottom: 32px; font-family: 'DM Mono', monospace; }
  label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  input[type=password] {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 20px;
  }
  input[type=password]:focus {
    border-color: var(--violet);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
  }
  button {
    width: 100%;
    background: linear-gradient(135deg, var(--violet), var(--violet-glow));
    border: none; border-radius: 10px;
    padding: 14px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    letter-spacing: 0.5px;
  }
  button:hover { opacity: 0.9; }
  button:active { transform: scale(0.98); }
  .error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    color: #f87171;
    font-size: 13px;
    margin-bottom: 16px;
    font-family: 'DM Mono', monospace;
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="glow-orb"></div>
<div class="card">
  <div class="logo">
    <div class="logo-icon">🤖</div>
    <div class="logo-text">Violet<span>WAB</span></div>
  </div>
  <h1>Accedi</h1>
  <p class="subtitle">// pannello di controllo</p>
  ${error ? `<div class="error">⚠️ ${error}</div>` : ""}
  <form method="POST" action="/login">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" placeholder="••••••••" autofocus>
    <button type="submit">Entra →</button>
  </form>
</div>
</body>
</html>`;
}
