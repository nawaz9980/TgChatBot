const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// /start command handler (private chat)
bot.start((ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply(
      '👋 Hi and welcome to our bot!\n\n👉 Add me to your group and I will welcome every new member with a nice message!',
      Markup.inlineKeyboard([
        Markup.button.url('➕ Add to Group', 'https://t.me/YourBotUsername?startgroup=true'),
        Markup.button.url('🌐 Visit Website', 'https://example.com')
      ])
    );
  }
});

// Welcome new group members
bot.on('new_chat_members', async (ctx) => {
  const newMember = ctx.message.new_chat_members[0];
  const firstName = newMember.first_name || "friend";
  const userMention = `[${firstName}](tg://user?id=${newMember.id})`;

  await ctx.replyWithMarkdown(
    `👋 Welcome ${userMention} to the group!`,
    Markup.inlineKeyboard([
      Markup.button.url('🌐 Visit Website', 'https://example.com')
    ])
  );
});

// Main webhook handler for Vercel
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Bot error:', err);
    res.status(500).send('Error');
  }
};
