import { getMentioned, removeAdmin } from "../utils/helpers.js";
import { FOUNDER } from "../config.js";

export default {
  name: "removeadmin",
  aliases: ["ra", "deladmin"],
  description: "Rimuovi un admin bot (solo Fondatore)",
  usage: "removeadmin @utente",
  category: "Gestione Bot",

  async execute({ msg, isFounder, reply }) {
    if (!isFounder) return reply("👑 Solo il *Fondatore* può rimuovere admin.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente da rimuovere.");

    for (const user of mentioned) {
      if (user === FOUNDER) {
        await reply(`👑 Non puoi rimuovere il Fondatore.`);
        continue;
      }
      const removed = removeAdmin(user);
      if (removed) {
        await reply(`✅ @${user.split("@")[0]} rimosso dagli *Admin Bot*.`);
      } else {
        await reply(`ℹ️ @${user.split("@")[0]} non era admin.`);
      }
    }
  },
};
