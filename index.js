const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require("fs");
const path = require("path");
const P = { printQRInTerminal: true };   // ✅ QR Code enabled
require("dotenv").config();

const PREFIX = process.env.PREFIX || "!";
const OWNER = process.env.OWNER_NUMBER;

// Load all commands dynamically
function loadCommands() {
  const commands = {};
  const dirPath = path.join(__dirname, "commands");

  fs.readdirSync(dirPath).forEach(file => {
    if (file.endsWith(".js")) {
      const cmd = require(path.join(dirPath, file));
      commands[cmd.name] = cmd;
    }
  });

  return commands;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,
    ...P   // ✅ PRINT QR FIX
  });

  sock.ev.on("creds.update", saveCreds);

  const commands = loadCommands();

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text = msg.message.conversation || "";
    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if (commands[cmdName]) {
      try {
        await commands[cmdName].execute(sock, msg, args);
      } catch (err) {
        console.log("Command error:", err);
      }
    }
  });

  console.log("Bot started successfully.");
}

startBot();
