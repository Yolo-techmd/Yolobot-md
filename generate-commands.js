// generate-commands.js
// Run this once to auto-create simple command files in /commands

const fs = require("fs");
const path = require("path");

// Make sure commands folder exists
const commandsDir = path.join(__dirname, "commands");
if (!fs.existsSync(commandsDir)) {
  fs.mkdirSync(commandsDir);
  console.log("Created commands directory");
}

// Helper to create one command file
function createCommandFile(cmd) {
  const fileName = `${cmd.file}.js`;
  const filePath = path.join(commandsDir, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping existing file: ${fileName}`);
    return;
  }

  const content = `require("dotenv").config();
const PREFIX = process.env.PREFIX || "!";

module.exports = {
  name: "${cmd.name}",
  aliases: ${JSON.stringify(cmd.aliases || [cmd.name])},
  category: "${cmd.category}",
  run: async ({ sock, msg, from, args }) => {
    await sock.sendMessage(from, {
      text:
        "🟢 *${cmd.name}* command\\n" +
        "\\n" +
        "This is a placeholder for the *${cmd.name}* command.\\n" +
        "Usage: " + PREFIX + "${cmd.name}" + " ...",
      quoted: msg,
    });
  },
};
`;

  fs.writeFileSync(filePath, content.trimStart() + "\n");
  console.log(`Created ${fileName}`);
}

// All your commands (from that big menu)
const commands = [
  // GENERAL
  { file: "setvar",       name: "setvar",       category: "General" },
  { file: "getvar",       name: "getvar",       category: "General" },
  { file: "delvar",       name: "delvar",       category: "General" },
  { file: "setenv",       name: "setenv",       category: "General" },
  { file: "delsudo",      name: "delsudo",      category: "General" },
  { file: "afk",          name: "afk",          category: "General" },
  { file: "autodl",       name: "autodl",       category: "General" },
  { file: "chatbot",      name: "chatbot",      category: "General" },
  { file: "ai",           name: "ai",           category: "General" },
  { file: "info",         name: "info",         category: "General" },
  { file: "list",         name: "list",         category: "General" },
  { file: "alive",        name: "alive",        category: "General" },
  { file: "setalive",     name: "setalive",     category: "General" },
  { file: "games",        name: "games",        category: "General" },
  { file: "math",         name: "math",         category: "General" },
  { file: "endmath",      name: "endmath",      category: "General" },
  { file: "gif",          name: "gif",          category: "General" },
  { file: "rotate",       name: "rotate",       category: "General" },
  { file: "flip",         name: "flip",         category: "General" },
  { file: "mee",          name: "mee",          category: "General" },
  { file: "mention",      name: "mention",      category: "General" },
  { file: "presence",     name: "presence",     category: "General" },
  { file: "typing",       name: "typing",       category: "General" },
  { file: "recording",    name: "recording",    category: "General" },
  { file: "stoppresence", name: "stoppresence", category: "General" },
  { file: "reload",       name: "reload",       category: "General" },
  { file: "reboot",       name: "reboot",       category: "General" },
  { file: "delete",       name: "delete",       category: "General" },
  { file: "wcg",          name: "wcg",          category: "General" },
  { file: "endwcg",       name: "endwcg",       category: "General" },
  { file: "wcgstats",     name: "wcgstats",     category: "General" },

  // OWNER
  { file: "allvar",   name: "allvar",   category: "Owner" },
  { file: "settings", name: "settings", category: "Owner" },
  { file: "setsudo",  name: "setsudo",  category: "Owner" },
  { file: "getsudo",  name: "getsudo",  category: "Owner" },
  { file: "callreject", name: "callreject", category: "Owner" },
  { file: "install",  name: "install",  category: "Owner" },
  { file: "plugin",   name: "plugin",   category: "Owner" },
  { file: "remove",   name: "remove",   category: "Owner" },
  { file: "pupdate",  name: "pupdate",  category: "Owner" },
  { file: "block",    name: "block",    category: "Owner" },
  { file: "join",     name: "join",     category: "Owner" },
  { file: "unblock",  name: "unblock",  category: "Owner" },
  { file: "pp",       name: "pp",       category: "Owner" },
  { file: "gpp",      name: "gpp",      category: "Owner" },
  { file: "update",   name: "update",   category: "Owner" },

  // SETTINGS
  { file: "platform",  name: "platform",  category: "Settings" },
  { file: "language",  name: "language",  category: "Settings" },
  { file: "mode",      name: "mode",      category: "Settings" },
  { file: "antidelete",name: "antidelete",category: "Settings" },
  { file: "setinfo",   name: "setinfo",   category: "Settings" },
  { file: "setname",   name: "setname",   category: "Settings" },
  { file: "setowner",  name: "setowner",  category: "Settings" },
  { file: "setimage",  name: "setimage",  category: "Settings" },

  // GROUP
  { file: "toggle",       name: "toggle",       category: "Group" },
  { file: "antibot",      name: "antibot",      category: "Group" },
  { file: "antispam",     name: "antispam",     category: "Group" },
  { file: "pdm",          name: "pdm",          category: "Group" },
  { file: "antidemote",   name: "antidemote",   category: "Group" },
  { file: "antipromote",  name: "antipromote",  category: "Group" },
  { file: "antilink",     name: "antilink",     category: "Group" },
  { file: "antiword",     name: "antiword",     category: "Group" },
  { file: "ginfo",        name: "ginfo",        category: "Group" },
  { file: "automute",     name: "automute",     category: "Group" },
  { file: "autounmute",   name: "autounmute",   category: "Group" },
  { file: "getmute",      name: "getmute",      category: "Group" },
  { file: "antifake",     name: "antifake",     category: "Group" },
  { file: "kick",         name: "kick",         category: "Group" },
  { file: "add",          name: "add",          category: "Group" },
  { file: "promote",      name: "promote",      category: "Group" },
  { file: "requests",     name: "requests",     category: "Group" },
  { file: "leave",        name: "leave",        category: "Group" },
  { file: "quoted",       name: "quoted",       category: "Group" },
  { file: "demote",       name: "demote",       category: "Group" },
  { file: "mute",         name: "mute",         category: "Group" },
  { file: "unmute",       name: "unmute",       category: "Group" },
  { file: "jid",          name: "jid",          category: "Group" },
  { file: "invite",       name: "invite",       category: "Group" },
  { file: "revoke",       name: "revoke",       category: "Group" },
  { file: "glock",        name: "glock",        category: "Group" },
  { file: "gunlock",      name: "gunlock",      category: "Group" },
  { file: "gname",        name: "gname",        category: "Group" },
  { file: "gdesc",        name: "gdesc",        category: "Group" },
  { file: "common",       name: "common",       category: "Group" },
  { file: "tag",          name: "tag",          category: "Group" },
  { file: "msgs",         name: "msgs",         category: "Group" },
  { file: "inactive",     name: "inactive",     category: "Group" },
  { file: "warn",         name: "warn",         category: "Group" },
  { file: "warnings",     name: "warnings",     category: "Group" },
  { file: "rmwarn",       name: "rmwarn",       category: "Group" },
  { file: "resetwarn",    name: "resetwarn",    category: "Group" },
  { file: "warnlist",     name: "warnlist",     category: "Group" },
  { file: "setwarnlimit", name: "setwarnlimit", category: "Group" },
  { file: "warnstats",    name: "warnstats",    category: "Group" },
  { file: "welcome",      name: "welcome",      category: "Group" },
  { file: "goodbye",      name: "goodbye",      category: "Group" },
  { file: "testwelcome",  name: "testwelcome",  category: "Group" },
  { file: "testgoodbye",  name: "testgoodbye",  category: "Group" },

  // UTILITY
  { file: "uptime",    name: "uptime",    category: "Utility" },
  { file: "menu",      name: "menu",      category: "Utility" },
  { file: "testalive", name: "testalive", category: "Utility" },
  { file: "attp",      name: "attp",      category: "Utility" },
  { file: "tts",       name: "tts",       category: "Utility" },
  { file: "upload",    name: "upload",    category: "Utility" },
  { file: "fancy",     name: "fancy",     category: "Utility" },
  { file: "filter",    name: "filter",    category: "Utility" },
  { file: "filters",   name: "filters",   category: "Utility" },
  { file: "delfilter", name: "delfilter", category: "Utility" },
  { file: "togglefilter", name: "togglefilter", category: "Utility" },
  { file: "testfilter",   name: "testfilter",   category: "Utility" },
  { file: "filterhelp",   name: "filterhelp",   category: "Utility" },
  { file: "stickcmd",     name: "stickcmd",     category: "Utility" },
  { file: "unstick",      name: "unstick",      category: "Utility" },
  { file: "getstick",     name: "getstick",     category: "Utility" },
  { file: "diff",         name: "diff",         category: "Utility" },
  { file: "getjids",      name: "getjids",      category: "Utility" },
  { file: "users",        name: "users",        category: "Utility" },
  { file: "schedule",     name: "schedule",     category: "Utility" },
  { file: "scheduled",    name: "scheduled",    category: "Utility" },
  { file: "cancel",       name: "cancel",       category: "Utility" },
  { file: "age",          name: "age",          category: "Utility" },
  { file: "cntd",         name: "cntd",         category: "Utility" },
  { file: "ping",         name: "ping",         category: "Utility" },
  { file: "vv",           name: "vv",           category: "Utility" },

  // SEARCH
  { file: "img",  name: "img",  category: "Search" },
  { file: "find", name: "find", category: "Search" },
  { file: "ig",   name: "ig",   category: "Search" },

  // EDIT
  { file: "sticker",  name: "sticker",  category: "Edit" },
  { file: "mp3",      name: "mp3",      category: "Edit" },
  { file: "slow",     name: "slow",     category: "Edit" },
  { file: "sped",     name: "sped",     category: "Edit" },
  { file: "bass",     name: "bass",     category: "Edit" },
  { file: "photo",    name: "photo",    category: "Edit" },
  { file: "doc",      name: "doc",      category: "Edit" },
  { file: "square",   name: "square",   category: "Edit" },
  { file: "resize",   name: "resize",   category: "Edit" },
  { file: "compress", name: "compress", category: "Edit" },
  { file: "trim",     name: "trim",     category: "Edit" },
  { file: "black",    name: "black",    category: "Edit" },
  { file: "avmix",    name: "avmix",    category: "Edit" },
  { file: "vmix",     name: "vmix",     category: "Edit" },
  { file: "slowmo",   name: "slowmo",   category: "Edit" },
  { file: "circle",   name: "circle",   category: "Edit" },
  { file: "interp",   name: "interp",   category: "Edit" },
  { file: "take",     name: "take",     category: "Edit" },
  { file: "mp4",      name: "mp4",      category: "Edit" },
  { file: "url",      name: "url",      category: "Edit" },

  // MISC
  { file: "clear", name: "clear", category: "Misc" },
  { file: "retry", name: "retry", category: "Misc" },

  // CONVERTERS
  { file: "pdf",   name: "pdf",   category: "Converters" },

  // SYSTEM
  { file: "restart", name: "restart", category: "System" },

  // DOWNLOAD
  { file: "insta",     name: "insta",     category: "Download" },
  { file: "fb",        name: "fb",        category: "Download" },
  { file: "story",     name: "story",     category: "Download" },
  { file: "pinterest", name: "pinterest", category: "Download" },
  { file: "tiktok",    name: "tiktok",    category: "Download" },
  { file: "song",      name: "song",      category: "Download" },
  { file: "yts",       name: "yts",       category: "Download" },
  { file: "ytv",       name: "ytv",       category: "Download" },
  { file: "video",     name: "video",     category: "Download" },
  { file: "yta",       name: "yta",       category: "Download" },
  { file: "play",      name: "play",      category: "Download" },
  { file: "spotify",   name: "spotify",   category: "Download" },

  // WHATSAPP
  { file: "react",   name: "react",   category: "Whatsapp" },
  { file: "editmsg", name: "edit",    category: "Whatsapp" },
  { file: "send",    name: "send",    category: "Whatsapp" },
  { file: "forward", name: "forward", category: "Whatsapp" },
];

commands.forEach(createCommandFile);

console.log("✅ Done generating command files.");
