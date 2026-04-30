import helpCmd from "./help.js";
import pingCmd from "./ping.js";
import infoCmd from "./info.js";
import kickCmd from "./kick.js";
import warnCmd from "./warn.js";
import warnsCmd from "./warns.js";
import clearwarnsCmd from "./clearwarns.js";
import muteCmd from "./mute.js";
import unmuteCmd from "./unmute.js";
import tagallCmd from "./tagall.js";
import stickerCmd from "./sticker.js";
import botCmd from "./bot.js";

const commandList = [
  helpCmd,
  pingCmd,
  infoCmd,
  kickCmd,
  warnCmd,
  warnsCmd,
  clearwarnsCmd,
  muteCmd,
  unmuteCmd,
  tagallCmd,
  stickerCmd,
  botCmd,
];

const commandMap = new Map();

for (const cmd of commandList) {
  commandMap.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commandMap.set(alias, cmd);
    }
  }
}

export function getCommands() {
  return commandMap;
}

export function getCommandList() {
  return commandList;
}
