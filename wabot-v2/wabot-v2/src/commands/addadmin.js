import { getMentioned, addAdmin, isFounder, getAdmins } from "../utils/helpers.js";
import { FOUNDER } from "../config.js";

export default {
  name: "addadmin",
  aliases: ["aa"],
  description: "Aggiungi un admin bot (solo Fondatore)",
  usage: "addadmin @utente",
  category: "Gestione Bot",

  async execute({ msg, jid, senderJid, isFounder, reply }) {
    if (!isFounder) return reply("👑 Solo il *Fondatore* può aggiungere admin.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente da promuovere.");

    for (const user of mentioned) {
      if (user === FOUNDER) {
        await reply(`👑 @${user.split("@")[0]} è già il Fondatore.`);
        continue;
      }
      const added = addAdmin(user);
      if (added) {
        await reply(`✅ @${user.split("@")[0]} è ora *Admin Bot*.`);
      } else {
        await reply(`ℹ️ @${user.split("@")[0]} è già admin.`);
      }
    }
  },
};
