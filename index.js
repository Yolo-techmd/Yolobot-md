const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
require("dotenv").config();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log("Logged out.");
            }
        } else if (connection === "open") {
            console.log("Bot is online!");
        }
    });

    // Basic command
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        const text = msg.message?.conversation;

        if (!text) return;

        if (text.toLowerCase() === "hi") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "Hello Gentle Yolo! 😎 Your bot is working."
            });
        }
    });
}

startBot();
