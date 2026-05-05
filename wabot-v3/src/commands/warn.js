import { getMentioned, getWarnDB, saveWarnDB } from "../utils/helpers.js";

const MAX_WARNS = 3;

export default {
  name: "warn",
  aliases: ["w"],
  description: `Avverti un membro (kick automatico a ${MAX_WARNS} warn)`,
  usage: "warn @utente [motivo]",
  category: "Moderazione",

  async execute({ sock, msg, jid, isGroup, isAdmin, args, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente da avvertire.");

    const reason = args.slice(1).join(" ") || "Nessun motivo specificato";
    const db = getWarnDB();

    for (const user of mentioned) {
      const key = `${jid}:${user}`;
      const current = (db[key] || 0) + 1;
      db[key] = current;
      saveWarnDB(db);

      if (current >= MAX_WARNS) {
        db[key] = 0;
        saveWarnDB(db);
        try {
          await sock.groupParticipantsUpdate(jid, [user], "remove");
          await reply(`🚫 @${user.split("@")[0]} è stato rimosso dopo ${MAX_WARNS} avvertimenti!`);
        } catch {
          await reply(`⚠️ @${user.split("@")[0]} ha raggiunto ${MAX_WARNS} warn ma non riesco a rimuoverlo.`);
        }
      } else {
        await reply(
          `⚠️ *AVVERTIMENTO* per @${user.split("@")[0]}\n` +
          `📝 Motivo: ${reason}\n` +
          `🔢 Warn: ${current}/${MAX_WARNS}`
        );
      }
    }
  },
};
