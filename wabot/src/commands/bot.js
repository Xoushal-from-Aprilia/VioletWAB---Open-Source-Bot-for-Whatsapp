import { BOT_NAME } from "../config.js";

export default {
  name: "bot",
  aliases: ["status"],
  description: "Controlla se il bot è online",
  usage: "bot",
  category: "Generale",

  async execute({ reply }) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    await reply(`✅ *${BOT_NAME}* è online!\n⏱️ Uptime: ${h}h ${m}m`);
  },
};
