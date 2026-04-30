import { PREFIX, COOLDOWN_MS } from "./config.js";
import { getCommands } from "./commands/index.js";
import { extractText, getJid, react } from "./utils/helpers.js";

const cooldowns = new Map();

export async function handleMessage(sock, msg, store) {
  const jid = msg.key.remoteJid;
  const senderJid = msg.key.participant || jid; // partecipante in gruppo o JID privato
  const senderNumber = senderJid.replace("@s.whatsapp.net", "").replace("@g.us", "");
  const isGroup = jid.endsWith("@g.us");

  const text = extractText(msg);
  if (!text || !text.startsWith(PREFIX)) return;

  // ── Cooldown anti-spam ──────────────────────────────────
  const now = Date.now();
  const lastUsed = cooldowns.get(senderJid) || 0;
  if (now - lastUsed < COOLDOWN_MS) return;
  cooldowns.set(senderJid, now);

  // ── Parse comando e args ────────────────────────────────
  const parts = text.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const commands = getCommands();
  const command = commands.get(commandName);

  if (!command) {
    await sock.sendMessage(jid, {
      text: `❓ Comando *${PREFIX}${commandName}* non trovato.\nUsa *${PREFIX}help* per vedere i comandi.`,
    }, { quoted: msg });
    return;
  }

  // ── Esegui comando ──────────────────────────────────────
  const ctx = {
    sock,
    msg,
    jid,
    senderJid,
    senderNumber,
    isGroup,
    args,
    store,
    reply: (text) => sock.sendMessage(jid, { text }, { quoted: msg }),
    react: (emoji) => react(sock, msg, emoji),
  };

  try {
    await react(sock, msg, "⏳");
    await command.execute(ctx);
  } catch (err) {
    console.error(`[ERRORE] comando ${commandName}:`, err);
    await sock.sendMessage(jid, { text: `❌ Errore nell'esecuzione del comando.` }, { quoted: msg });
  }
}
