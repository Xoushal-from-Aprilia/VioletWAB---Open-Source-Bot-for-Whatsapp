import { getAdmins } from "../utils/helpers.js";
import { FOUNDER } from "../config.js";

export default {
  name: "adminlist",
  aliases: ["admins", "al"],
  description: "Lista degli admin del bot",
  usage: "adminlist",
  category: "Gestione Bot",

  async execute({ reply }) {
    const admins = getAdmins();
    const founderShort = FOUNDER.split("@")[0];

    let text = `👑 *Fondatore:* @${founderShort}\n\n`;

    if (admins.length === 0) {
      text += "📋 *Admin Bot:* nessuno ancora.";
    } else {
      text += `📋 *Admin Bot (${admins.length}):*\n`;
      admins.forEach((a, i) => {
        text += `${i + 1}. @${a.split("@")[0]}\n`;
      });
    }

    await reply(text);
  },
};
