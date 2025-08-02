const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (!message || !message.text) return res.sendStatus(200);

    const text = message.text;
    const fromUser = message.from?.username || message.from?.first_name || 'Unknown';
    const chat_id = process.env.TELEGRAM_CHANNEL_ID;

    console.log(`📩 Received from ${fromUser}: ${text}`);

    try {
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chat_id,
            text: `📢 *${fromUser}*: ${text}`,
            parse_mode: 'Markdown'
        });
        console.log(`✅ Forwarded to channel`);
    } catch (error) {
        console.error("❌ Error sending to Telegram:", error.response?.data || error.message);
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
