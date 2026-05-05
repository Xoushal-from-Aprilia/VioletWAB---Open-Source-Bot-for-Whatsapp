import { isGroupAdmin } from "../utils/helpers.js";

export default {
  name: "mute",
  aliases: ["lock"],
  description: "Silenzia il gruppo (solo admin possono scrivere)",
  usage: "mute",
  category: "Moderazione",

  async execute({ sock, jid, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const groupMeta = await sock.groupMetadata(jid);
    const botJid = sock.user.id.split(":")[0];
    if (!isGroupAdmin(groupMeta, botJid)) return reply("❌ Il bot non è admin del gruppo.");

    await sock.groupSettingUpdate(jid, "announcement");
    await reply("🔇 Gruppo silenziato. Solo gli admin possono scrivere.");
  },
};
