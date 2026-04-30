import { isGroupAdmin } from "../utils/helpers.js";

export default {
  name: "unmute",
  aliases: ["unlock"],
  description: "Riapri il gruppo a tutti",
  usage: "unmute",
  category: "Moderazione",

  async execute({ sock, jid, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const groupMeta = await sock.groupMetadata(jid);
    const botJid = sock.user.id.split(":")[0];
    if (!isGroupAdmin(groupMeta, botJid)) return reply("❌ Il bot non è admin del gruppo.");

    await sock.groupSettingUpdate(jid, "not_announcement");
    await reply("🔊 Gruppo riaperto. Tutti possono scrivere.");
  },
};
