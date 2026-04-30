import { readFileSync, writeFileSync, existsSync } from "fs";

const WARN_FILE = "warns.json";

// ── Estrai testo dal messaggio ──────────────────────────────
export function extractText(msg) {
  const m = msg.message;
  if (!m) return "";
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ""
  );
}

// ── Ottieni JID da numero ───────────────────────────────────
export function getJid(number) {
  return number.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
}

// ── Reagisci a un messaggio ─────────────────────────────────
export async function react(sock, msg, emoji) {
  try {
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: emoji, key: msg.key },
    });
  } catch {}
}

// ── Ottieni utenti menzionati ───────────────────────────────
export function getMentioned(msg) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  return ctx?.mentionedJid || [];
}

// ── Controlla se un JID è admin del gruppo ──────────────────
export function isAdmin(groupMeta, jid) {
  return groupMeta.participants.some(
    p => p.id === jid && (p.admin === "admin" || p.admin === "superadmin")
  );
}

// ── Database warn (JSON semplice) ───────────────────────────
export function getWarnDB() {
  if (!existsSync(WARN_FILE)) return {};
  try {
    return JSON.parse(readFileSync(WARN_FILE, "utf8"));
  } catch {
    return {};
  }
}

export function saveWarnDB(db) {
  writeFileSync(WARN_FILE, JSON.stringify(db, null, 2));
}
