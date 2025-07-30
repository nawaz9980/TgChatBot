const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Reply to /start in private chat
bot.start((ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply(
      '👋 Hi! I am your Telegram bot.\n\n➕ Add me to your group, and I will welcome every new member!',
      Markup.inlineKeyboard([
        Markup.button.url('➕ Add to Group', 'https://t.me/YourBotUsername?startgroup=true'),
        Markup.button.url('🌐 Visit Website', 'https://example.com')
      ])
    );
  }
});

// Welcome new members in group
bot.on('new_chat_members', async (ctx) => {
  const members = ctx.message.new_chat_members;
  for (let member of members) {
    const mention = `[${member.first_name}](tg://user?id=${member.id})`;
    await ctx.replyWithMarkdown(
      `🎉 Welcome ${mention} to the group!`,
      Markup.inlineKeyboard([
        Markup.button.url('🌐 Visit Website', 'https://example.com')
      ])
    );
  }
});

// Vercel webhook handler
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error in bot:', err);
    res.status(500).send('Error');
  }
};
