import { getMentioned, isGroupAdmin } from "../utils/helpers.js";

export default {
  name: "kick",
  aliases: ["remove"],
  description: "Rimuovi un membro dal gruppo (solo admin bot)",
  usage: "kick @utente",
  category: "Moderazione",

  async execute({ sock, msg, jid, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const mentioned = getMentioned(msg);
    if (!mentioned.length) return reply("⚠️ Menziona un utente da rimuovere.");

    const groupMeta = await sock.groupMetadata(jid);
    const botJid = sock.user.id.split(":")[0];
    if (!isGroupAdmin(groupMeta, botJid)) return reply("❌ Il bot non è admin del gruppo.");

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
