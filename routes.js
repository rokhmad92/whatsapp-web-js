const express = require('express');
const router = express.Router();
const { client, MessageMedia, getQrString } = require('./whatsapp');

// Middleware API Key
function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey)
    return res.status(401).json({ status: 401, message: 'Unauthorized' });
  next();
}

router.use(apiKeyMiddleware);

router.get('/get-qr', (req, res) => {
  const qr = getQrString();
  if (qr) {
    res.json({ data: qr });
  } else {
    res.json({ data: 200 });
  }
});

router.post('/message', async (req, res) => {
  const { nomer, pesan, image } = req.body;
  const phone = `${nomer}@c.us`;

  try {
    const isRegistered = await client.isRegisteredUser(phone);
    if (!isRegistered) return res.status(200).json({ status: 400, message: `Nomor tidak terdaftar di WhatsApp - ${nomer}` });

    let message = null;

    if (image) {
      // Form URL
      const media = await MessageMedia.fromUrl(image);
      await client.sendMessage(phone, media, { caption: pesan });
    } else {
      message = await client.sendMessage(phone, pesan);
    }

    return res.status(201).json({
      status: 201,
      message: `Berhasil kirim pesan - ${nomer}`,
      message_id: message.id._serialized,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ status: 500, message: `Terjadi kesalahan - ${nomer} - ${error}` });
  }
});

module.exports = router;
