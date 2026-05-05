import { PREFIX, COOLDOWN_MS } from "./config.js";
import { getCommands } from "./commands/index.js";
import { extractText, react, isAdmin, isFounder } from "./utils/helpers.js";
import { state, addLog } from "./state.js";

const cooldowns = new Map();

export async function handleMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  const senderJid = msg.key.participant || jid;
  const isGroup = jid.endsWith("@g.us");

  const text = extractText(msg);
  if (!text || !text.startsWith(PREFIX)) return;

  const now = Date.now();
  const lastUsed = cooldowns.get(senderJid) || 0;
  if (now - lastUsed < COOLDOWN_MS) return;
  cooldowns.set(senderJid, now);

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

  const ctx = {
    sock, msg, jid, senderJid,
    senderNumber: senderJid,
    isGroup, args,
    isAdmin: isAdmin(senderJid),
    isFounder: isFounder(senderJid),
    reply: (text) => sock.sendMessage(jid, { text }, { quoted: msg }),
    react: (emoji) => react(sock, msg, emoji),
  };

  try {
    await react(sock, msg, "⏳");
    await command.execute(ctx);
    state.commandsExecuted++;
    addLog("info", `📨 ${PREFIX}${commandName} da @${senderJid.split("@")[0]}`);
  } catch (err) {
    console.error(`[ERRORE] comando ${commandName}:`, err);
    addLog("error", `❌ Errore in ${PREFIX}${commandName}: ${err.message}`);
    await sock.sendMessage(jid, { text: `❌ Errore nell'esecuzione del comando.` }, { quoted: msg });
  }
}
