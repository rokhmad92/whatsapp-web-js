const express = require('express');
const router = express.Router();

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
      const media = await MessageMedia.fromUrl(image);
      await client.sendMessage(phone, media, { caption: pesan });
    } else {
      message = await client.sendMessage(phone, pesan);
    }

    // messageIdToBroadcastId.set(message.id._serialized, id);
    // saveMapping(message.id._serialized, id);

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

// const path = require('path');
// const fs = require('fs');
// const { client, MessageMedia, getQrString } = require('./whatsapp');
// const messageIdToBroadcastId = require('./message_map');

// router.get('/message/:id', (req, res) => {
//   const filePath = path.join(__dirname, 'message_ack', `${req.params.id}.json`);

//   try {
//     if (!fs.existsSync(filePath)) return res.json([]);

//     const data = fs.readFileSync(filePath, 'utf-8');
//     const parsed = data ? JSON.parse(data) : [];
//     res.json(parsed);
//   } catch (err) {
//     res.status(500).json({ error: 'Gagal membaca file' });
//   }
// });


// const mappingPath = path.join(__dirname, 'message_mapping.json');
// function saveMapping(messageId, broadcastId) {
//   let mappings = {};
//   if (fs.existsSync(mappingPath)) {
//     mappings = JSON.parse(fs.readFileSync(mappingPath));
//   }
//   mappings[messageId] = broadcastId;
//   fs.writeFileSync(mappingPath, JSON.stringify(mappings, null, 2));
// }

module.exports = router;
