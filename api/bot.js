const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Reply to /start and auto-delete after 60 seconds
bot.start(async (ctx) => {
  if (ctx.chat.type === 'private') {
    const sent = await ctx.reply(
      '👋 Hi and welcome to our bot!\n\n➕ Add me to your group, and I’ll welcome new members!',
      Markup.inlineKeyboard([
        Markup.button.url('➕ Add to Group', 'https://t.me/YourBotUsername?startgroup=true'),
        Markup.button.url('🌐 Visit Website', 'https://example.com')
      ])
    );

    // Auto-delete after 60 seconds
    setTimeout(() => {
      ctx.deleteMessage(sent.message_id).catch(() => {});
    }, 60000); // 60 sec
  }
});

// Welcome new group members and auto-delete after 60 sec
bot.on('new_chat_members', async (ctx) => {
  const member = ctx.message.new_chat_members[0];
  const name = member.first_name || 'friend';
  const mention = `[${name}](tg://user?id=${member.id})`;

  const sent = await ctx.replyWithMarkdown(
    `🎉 Welcome ${mention} to the group!`,
    Markup.inlineKeyboard([
      Markup.button.url('🌐 Visit Website', 'https://example.com')
    ])
  );

  // Auto-delete welcome after 60 sec
  setTimeout(() => {
    ctx.deleteMessage(sent.message_id).catch(() => {});
  }, 60000);
});

// Webhook handler
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Bot error:', err);
    res.status(500).send('Error');
  }
};
