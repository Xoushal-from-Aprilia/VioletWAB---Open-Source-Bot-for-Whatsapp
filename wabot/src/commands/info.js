import { BOT_NAME, PREFIX } from "../config.js";
import { getCommandList } from "./index.js";
import os from "os";

export default {
  name: "info",
  aliases: ["about"],
  description: "Informazioni sul bot e sul sistema",
  usage: "info",
  category: "Generale",

  async execute({ reply }) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const mem = process.memoryUsage();
    const totalCmds = getCommandList().length;

    await reply(
      `🤖 *${BOT_NAME}*\n\n` +
      `📦 *Comandi disponibili:* ${totalCmds}\n` +
      `⏱️ *Uptime:* ${h}h ${m}m ${s}s\n` +
      `💾 *RAM usata:* ${(mem.rss / 1024 / 1024).toFixed(1)} MB\n` +
      `🖥️ *OS:* ${os.type()} ${os.arch()}\n` +
      `⚙️ *Node.js:* ${process.version}\n` +
      `📡 *Prefisso:* ${PREFIX}\n\n` +
      `_Self-hosted su Termux_ 🟢`
    );
  },
};
