// Yolobot-md main file

// Imports
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// Env settings
const PREFIX = process.env.PREFIX || '!';
const OWNER = process.env.OWNER_NUMBER || '';

// =========================
// Load all commands
// =========================
function loadCommands() {
  const commands = {};
  const dirPath = path.join(__dirname, 'commands');

  if (!fs.existsSync(dirPath)) {
    console.log('commands folder not found, creating one...');
    fs.mkdirSync(dirPath);
    return commands;
  }

  fs.readdirSync(dirPath).forEach((file) => {
    if (file.endsWith('.js')) {
      const cmd = require(path.join(dirPath, file));
      if (cmd && cmd.name) {
        commands[cmd.name] = cmd;
        // also load aliases if present
        if (Array.isArray(cmd.aliases)) {
          cmd.aliases.forEach((alias) => {
            commands[alias] = cmd;
          });
        }
      }
    }
  });

  console.log('Loaded commands:', Object.keys(commands));
  return commands;
}

// =========================
// Start bot
// =========================
async function startBot() {
  // Auth state (multi-device)
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  // Create socket
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // we handle QR ourselves
    browser: ['Yolobot-md', 'Chrome', '1.0.0'],
  });

  // Save credentials when updated
  sock.ev.on('creds.update', saveCreds);

  // Connection updates (QR, reconnect, etc.)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Show QR in console
    if (qr) {
      console.log('SCAN THIS QR CODE WITH WHATSAPP (Linked devices) ⬇️');
      qrcode.generate(qr, { small: true });
    }

    // Connection closed → maybe reconnect
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;

      console.log('Connection closed. Reason:', reason);

      if (shouldReconnect) {
        console.log('Reconnecting...');
        startBot().catch(console.error);
      } else {
        console.log('Logged out. Delete auth folder if you want to re-link.');
      }
    }

    if (connection === 'open') {
      console.log('✅ Yolobot-md is connected to WhatsApp!');
      if (OWNER) {
        sock.sendMessage(OWNER + '@s.whatsapp.net', {
          text: '✅ Yolobot-md is now online.',
        }).catch(() => {});
      }
    }
  });

  // Load commands
  const commands = loadCommands();

  // Listen for messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg || !msg.message) return;

    const from = msg.key.remoteJid;
    let text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      '';

    if (!text.startsWith(PREFIX)) return;

    // Break into command + args
    const args = text.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = commands[commandName];
    if (!command) return;

    try {
      await command.run({ sock, msg, from, args });
    } catch (err) {
      console.error('Command error:', err);
      await sock.sendMessage(
        from,
        { text: '❌ Error running command.' },
        { quoted: msg }
      );
    }
  });
}

// Start the bot
startBot().catch((err) => console.error('Fatal error:', err));
