import { readFileSync, writeFileSync, existsSync } from "fs";
import { FOUNDER, ADMINS_FILE } from "../config.js";

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
export function isGroupAdmin(groupMeta, jid) {
  return groupMeta.participants.some(
    p =>
      (p.id === jid || p.id?.includes(jid.split("@")[0])) &&
      (p.admin === "admin" || p.admin === "superadmin")
  );
}

// ── Gestione admin dinamici ─────────────────────────────────
export function getAdmins() {
  if (!existsSync(ADMINS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(ADMINS_FILE, "utf8"));
  } catch {
    return [];
  }
}

export function saveAdmins(list) {
  writeFileSync(ADMINS_FILE, JSON.stringify(list, null, 2));
}

export function isAdmin(senderJid) {
  if (senderJid === FOUNDER) return true;
  return getAdmins().includes(senderJid);
}

export function isFounder(senderJid) {
  return senderJid === FOUNDER;
}

export function addAdmin(jid) {
  const list = getAdmins();
  if (list.includes(jid)) return false;
  list.push(jid);
  saveAdmins(list);
  return true;
}

export function removeAdmin(jid) {
  const list = getAdmins();
  const idx = list.indexOf(jid);
  if (idx === -1) return false;
  list.splice(idx, 1);
  saveAdmins(list);
  return true;
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
