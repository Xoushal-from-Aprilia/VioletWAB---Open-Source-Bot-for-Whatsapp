export default {
  name: "ping",
  aliases: ["p"],
  description: "Controlla la latenza del bot",
  usage: "ping",
  category: "Generale",

  async execute({ reply, react }) {
    const start = Date.now();
    await reply("🏓 Pong!");
    const ms = Date.now() - start;
    await reply(`⚡ Latenza: *${ms}ms*`);
  },
};
