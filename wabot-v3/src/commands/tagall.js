export default {
  name: "tagall",
  aliases: ["everyone", "all"],
  description: "Menziona tutti i membri del gruppo",
  usage: "tagall [messaggio]",
  category: "Gruppi",

  async execute({ sock, msg, jid, isGroup, isAdmin, args, reply }) {
    if (!isGroup) return reply("❌ Questo comando funziona solo nei gruppi.");
    if (!isAdmin) return reply("⛔ Solo gli admin del bot possono usare questo comando.");

    const groupMeta = await sock.groupMetadata(jid);
    const members = groupMeta.participants.map(p => p.id);
    const message = args.join(" ") || "📢 Attenzione!";

    const text = `${message}\n\n` + members.map(m => `@${m.split("@")[0]}`).join(" ");
    await sock.sendMessage(jid, { text, mentions: members }, { quoted: msg });
  },
};
