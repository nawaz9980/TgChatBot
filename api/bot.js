const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handle new chat members (welcome message)
bot.on('new_chat_members', async (ctx) => {
  const newMember = ctx.message.new_chat_members[0];
  const firstName = newMember.first_name || "friend";
  const userMention = `[${firstName}](tg://user?id=${newMember.id})`;

  await ctx.replyWithMarkdown(
    `👋 Welcome ${userMention} to the group!`,
    Markup.inlineKeyboard([
      Markup.button.url('🔗 Visit Our Website', 'https://example.com')
    ])
  );
});

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
};
