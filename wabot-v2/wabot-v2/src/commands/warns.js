import { getMentioned, getWarnDB } from "../utils/helpers.js";

export default {
  name: "warns",
  aliases: ["warnlist"],
  description: "Controlla i warn di un utente",
  usage: "warns @utente",
  category: "Moderazione",

  async execute({ msg, jid, reply }) {
    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente.");

    const db = getWarnDB();
    for (const user of mentioned) {
      const key = `${jid}:${user}`;
      const warns = db[key] || 0;
      await reply(`📊 @${user.split("@")[0]} ha *${warns}/3* avvertimenti.`);
    }
  },
};
