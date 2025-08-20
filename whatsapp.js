const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

let qrString = null;

const client = new Client({
  puppeteer: {
    restartOnAuthFail: true,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions'],
  },
  authStrategy: new LocalAuth({ dataPath: 'auth_session' }),
});

client.on('qr', (qr) => (qrString = qr));
client.on('ready', () => (qrString = null));

client.initialize();

module.exports = {
  client,
  MessageMedia,
  getQrString: () => qrString,
};

// const path = require('path');
// const fs = require('fs');
// const messageIdToBroadcastId = require('./message_map');
// const messageAckPath = path.join(__dirname, 'message_ack');
// const mappingPath = path.join(__dirname, 'message_mapping.json');

// update status jika user sudah membaca pesan
// client.on('message_ack', async (msg, ack) => {
//   if (ack != 1) {
//     const messageId = msg.id._serialized;
//     let broadcastId = messageIdToBroadcastId.get(messageId);

//     // ⛑ Coba cari di file mapping kalau tidak ketemu di Map
//     if (!broadcastId) {
//       const fileMappings = loadMapping();
//       broadcastId = fileMappings[messageId];
//     }

//     if (!broadcastId) {
//       console.warn('Broadcast ID tidak ditemukan untuk message:', messageId);
//       return;
//     }

//     const filePath = path.join(messageAckPath, `${broadcastId}.json`);
//     const newEntry = {
//       message_id: messageId,
//       status: ack,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       let data = [];
//       if (fs.existsSync(filePath)) {
//         const existing = fs.readFileSync(filePath, 'utf-8');
//         data = existing ? JSON.parse(existing) : [];
//       }

//       const existingIndex = data.findIndex(
//         (entry) => entry.message_id === messageId
//       );
//       if (existingIndex !== -1) {
//         data[existingIndex] = newEntry;
//       } else {
//         data.push(newEntry);
//       }

//       fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//     } catch (err) {
//       console.error('Gagal simpan ke file:', err.message);
//     }
//   }
// });

// function loadMapping() {
//   try {
//     if (fs.existsSync(mappingPath)) {
//       const content = fs.readFileSync(mappingPath, 'utf-8');
//       if (content.trim() === '') return {}; // file kosong
//       return JSON.parse(content); // valid JSON
//     }
//   } catch (err) {
//     console.error('Gagal load mapping:', err.message);
//   }
//   return {};
// }
