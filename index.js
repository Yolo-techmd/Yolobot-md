const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PREFIX = process.env.PREFIX || "!";
const OWNER = process.env.OWNER_NUMBER;

// Load commands
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
    printQRInTerminal: true,  // ✓ Forces QR to show in console again
    browser: ["Mac OS", "Chrome", "14.1"],
  });

  sock.ev.on("creds.update", saveCreds);

  const commands = loadCommands();

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("SCAN THIS QR CODE WITH WHATSAPP:");
      console.log(qr);
    }
    if (connection === "open") console.log("BOT CONNECTED ✔");
    if (connection === "close") {
      console.log("Connection closed. Reconnecting...");
      startBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands[commandName];
    if (!command) return;

    try {
      await command.run({ sock, msg, from, args });
    } catch (err) {
      console.log("Command error:", err);
      await sock.sendMessage(from, { text: "❌ Error running command." });
    }
  });
}

startBot();
