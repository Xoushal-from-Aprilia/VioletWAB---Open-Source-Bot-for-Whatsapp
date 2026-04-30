import { PREFIX, BOT_NAME } from "../config.js";
import { getCommandList } from "./index.js";

export default {
  name: "help",
  aliases: ["h", "menu"],
  description: "Mostra tutti i comandi disponibili",
  usage: "help [comando]",
  category: "Generale",

  async execute({ reply, args }) {
    const cmdList = getCommandList();

    if (args[0]) {
      const cmd = cmdList.find(c => c.name === args[0].toLowerCase());
      if (!cmd) return reply(`❓ Comando *${args[0]}* non trovato.`);
      return reply(
        `📖 *${PREFIX}${cmd.name}*\n` +
        `📝 ${cmd.description}\n` +
        `🔧 Uso: ${PREFIX}${cmd.usage}\n` +
        (cmd.aliases ? `🔀 Alias: ${cmd.aliases.map(a => PREFIX + a).join(", ")}` : "")
      );
    }

    // Raggruppa per categoria
    const byCategory = {};
    for (const cmd of cmdList) {
      const cat = cmd.category || "Altro";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(cmd);
    }

    let text = `🤖 *${BOT_NAME}*\nPrefisso: *${PREFIX}*\n\n`;
    for (const [cat, cmds] of Object.entries(byCategory)) {
      text += `╔═ *${cat.toUpperCase()}*\n`;
      for (const cmd of cmds) {
        text += `║ ${PREFIX}${cmd.name} — ${cmd.description}\n`;
      }
      text += `╚═══════════\n\n`;
    }
    text += `💡 Usa *${PREFIX}help <comando>* per dettagli.`;

    await reply(text);
  },
};
