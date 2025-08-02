const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// 从 .env 文件中获取环境变量
const token = process.env.TELEGRAM_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID; // 注意应为 -100 开头的频道 ID

// 使用 Webhook 模式（Render 需要）
const bot = new TelegramBot(token, {
  webHook: {
    port: process.env.PORT || 10000,
  },
});

// 设置 Webhook URL
const WEBHOOK_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-render-url.onrender.com'}`;
bot.setWebHook(`${WEBHOOK_URL}/bot${token}`);

// 测试 log
console.log(`✅ Bot started via webhook at ${WEBHOOK_URL}/bot${token}`);

// 接收所有消息
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "匿名用户";
  const text = msg.text || '';

  console.log('📥 Received message:', text);

  // 回复用户
  bot.sendMessage(chatId, '✅ 我已经收到你的信息，谢谢！');

  // 转发到频道
  const forwardMessage = `📢 来自 @${username} 的新消息：\n${text}`;
  bot.sendMessage(channelId, forwardMessage).catch((err) => {
    console.error('❌ 转发到频道失败：', err);
  });
});
