const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

app.post('/', async (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const fromUser = message.from.username || message.from.first_name || 'Someone';
    const text = message.text;

    console.log(`Received message from ${fromUser}: ${text}`);

    // 发消息到频道
    try {
      await axios.post(TELEGRAM_API_URL, {
        chat_id: TELEGRAM_CHANNEL_ID,
        text: `📩 来自 ${fromUser}：${text}`
      });
      console.log('Message sent to channel successfully!');
    } catch (err) {
      console.error('Failed to send message to channel:', err.response ? err.response.data : err.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
