import { ADMINS } from "../config.js";
import { getMentioned, isAdmin } from "../utils/helpers.js";

export default {
  name: "kick",
  aliases: ["remove"],
  description: "Rimuovi un membro dal gruppo (solo admin)",
  usage: "kick @utente",
  category: "Moderazione",

  async execute({ sock, msg, jid, senderNumber, isGroup, reply, react }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!ADMINS.includes(senderNumber)) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente da rimuovere.");

    const groupMeta = await sock.groupMetadata(jid);
    const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const botIsAdmin = isAdmin(groupMeta, botNumber);

    if (!botIsAdmin) return reply("❌ Il bot non è admin del gruppo.");

    for (const user of mentioned) {
      try {
        await sock.groupParticipantsUpdate(jid, [user], "remove");
        await reply(`✅ @${user.split("@")[0]} rimosso dal gruppo.`);
      } catch {
        await reply(`❌ Non riesco a rimuovere @${user.split("@")[0]}.`);
      }
    }
  },
};
