import { ADMINS } from "../config.js";
import { isAdmin } from "../utils/helpers.js";

export default {
  name: "unmute",
  aliases: ["unlock"],
  description: "Riapri il gruppo a tutti",
  usage: "unmute",
  category: "Moderazione",

  async execute({ sock, jid, senderNumber, isGroup, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!ADMINS.includes(senderNumber)) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const groupMeta = await sock.groupMetadata(jid);
    if (!isAdmin(groupMeta, botNumber)) return reply("❌ Il bot non è admin del gruppo.");

    await sock.groupSettingUpdate(jid, "not_announcement");
    await reply("🔊 Gruppo riaperto. Tutti possono scrivere.");
  },
};
