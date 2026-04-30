import { getMentioned, getWarnDB, saveWarnDB } from "../utils/helpers.js";

export default {
  name: "clearwarns",
  aliases: ["resetwarns", "cw"],
  description: "Azzera i warn di un utente",
  usage: "clearwarns @utente",
  category: "Moderazione",

  async execute({ msg, jid, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente.");

    const db = getWarnDB();
    for (const user of mentioned) {
      const key = `${jid}:${user}`;
      db[key] = 0;
      saveWarnDB(db);
      await reply(`✅ Warn azzerati per @${user.split("@")[0]}.`);
    }
  },
};
