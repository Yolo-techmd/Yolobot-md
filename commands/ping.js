module.exports = {
  name: "ping",
  aliases: ["p"],
  run: async ({ sock, msg, from }) => {
    const start = Date.now();
    const sent = await sock.sendMessage(from, { text: "🏓 Pong..." });
    const diff = Date.now() - start;

    await sock.sendMessage(from, {
      text: `✅ Bot is alive!\n⏱ Response time: *${diff}ms*`,
      quoted: sent,
    });
  },
};
