import express from "express";
import session from "express-session";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { WEB_PASSWORD, BOT_NAME } from "../config.js";
import { state, addLog } from "../state.js";
import { getAdmins, addAdmin, removeAdmin, getWarnDB, saveWarnDB } from "../utils/helpers.js";
import { FOUNDER } from "../config.js";
import { getDashboardHTML } from "./dashboard.js";
import { getLoginHTML } from "./login.js";

export function startWebServer(port) {
  const app = express();
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: "violet-wab-secret-" + Math.random(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }));

  // ── WebSocket broadcast ──────────────────────────────────
  const clients = new Set();
  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });
  global.wsBroadcast = (data) => {
    for (const client of clients) {
      if (client.readyState === 1) client.send(data);
    }
  };

  // ── Auth middleware ──────────────────────────────────────
  const auth = (req, res, next) => {
    if (req.session.authenticated) return next();
    res.redirect("/login");
  };

  // ── Routes ───────────────────────────────────────────────
  app.get("/login", (req, res) => res.send(getLoginHTML()));

  app.post("/login", (req, res) => {
    if (req.body.password === WEB_PASSWORD) {
      req.session.authenticated = true;
      res.redirect("/");
    } else {
      res.send(getLoginHTML("Password errata!"));
    }
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  });

  app.get("/", auth, (req, res) => res.send(getDashboardHTML()));

  // ── API ──────────────────────────────────────────────────
  app.get("/api/status", auth, (req, res) => {
    res.json({
      connected: state.connected,
      qrCode: state.qrCode,
      messagesReceived: state.messagesReceived,
      commandsExecuted: state.commandsExecuted,
      uptime: process.uptime(),
      memory: process.memoryUsage().rss,
      groups: state.groups,
      admins: getAdmins(),
      founder: FOUNDER,
      logs: state.logs.slice(0, 50),
    });
  });

  app.post("/api/send", auth, async (req, res) => {
    const { jid, message } = req.body;
    if (!state.sock || !state.connected) return res.json({ ok: false, error: "Bot non connesso" });
    try {
      await state.sock.sendMessage(jid, { text: message });
      addLog("info", `📤 Messaggio inviato a ${jid}`);
      res.json({ ok: true });
    } catch (e) {
      res.json({ ok: false, error: e.message });
    }
  });

  app.post("/api/broadcast", auth, async (req, res) => {
    const { message } = req.body;
    if (!state.sock || !state.connected) return res.json({ ok: false, error: "Bot non connesso" });
    let sent = 0;
    for (const group of state.groups) {
      try {
        await state.sock.sendMessage(group.id, { text: message });
        sent++;
        await new Promise(r => setTimeout(r, 1000));
      } catch {}
    }
    addLog("info", `📢 Broadcast inviato a ${sent} gruppi`);
    res.json({ ok: true, sent });
  });

  app.post("/api/mute", auth, async (req, res) => {
    const { jid, action } = req.body;
    if (!state.sock || !state.connected) return res.json({ ok: false, error: "Bot non connesso" });
    try {
      await state.sock.groupSettingUpdate(jid, action === "mute" ? "announcement" : "not_announcement");
      addLog("info", `${action === "mute" ? "🔇" : "🔊"} Gruppo ${jid} ${action === "mute" ? "silenziato" : "riaperto"}`);
      res.json({ ok: true });
    } catch (e) {
      res.json({ ok: false, error: e.message });
    }
  });

  app.post("/api/admins/add", auth, (req, res) => {
    const { jid } = req.body;
    const ok = addAdmin(jid);
    addLog("info", `🛡️ Admin aggiunto: ${jid}`);
    res.json({ ok, admins: getAdmins() });
  });

  app.post("/api/admins/remove", auth, (req, res) => {
    const { jid } = req.body;
    if (jid === FOUNDER) return res.json({ ok: false, error: "Non puoi rimuovere il Fondatore" });
    const ok = removeAdmin(jid);
    addLog("info", `🗑️ Admin rimosso: ${jid}`);
    res.json({ ok, admins: getAdmins() });
  });

  app.get("/api/warns", auth, (req, res) => {
    res.json(getWarnDB());
  });

  app.post("/api/warns/clear", auth, (req, res) => {
    const { key } = req.body;
    const db = getWarnDB();
    db[key] = 0;
    saveWarnDB(db);
    res.json({ ok: true });
  });

  httpServer.listen(port, () => {
    addLog("info", `🌐 Pannello web avviato su http://localhost:${port}`);
    console.log(`🌐 Pannello web: http://localhost:${port}`);
  });
}
