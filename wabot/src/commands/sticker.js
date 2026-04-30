export default {
  name: "sticker",
  aliases: ["s", "stiker"],
  description: "Converti un'immagine in sticker (rispondi all'immagine)",
  usage: "sticker",
  category: "Divertimento",

  async execute({ sock, msg, jid, reply }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;

    if (!imageMsg) return reply("⚠️ Rispondi a un'immagine con !sticker");

    try {
      const buffer = await sock.downloadMediaMessage(
        quoted ? { message: quoted } : msg
      );

      await sock.sendMessage(jid, {
        sticker: buffer,
      }, { quoted: msg });
    } catch (err) {
      await reply("❌ Errore nella conversione dello sticker.");
    }
  },
};
