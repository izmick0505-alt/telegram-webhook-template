const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const message = req.body.message;

    if (!message || !message.text) {
        console.log("No message.text found.");
        return res.sendStatus(200);
    }

    const text = message.text.trim();
    const sender_id = message.chat.id;
    const channel_id = process.env.TELEGRAM_CHANNEL_ID;
    const bot_token = process.env.TELEGRAM_TOKEN;

    console.log("✅ 收到来自用户的消息:", text);
    console.log("📤 准备转发到频道:", channel_id);

    try {
        await axios.post(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
            chat_id: channel_id,
            text: text,
            parse_mode: 'Markdown'
        });

        console.log("✅ 成功转发到频道");
    } catch (error) {
        console.error("❌ 转发失败:", error.response?.data || error.message);
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
