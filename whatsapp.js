const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

let qrString = null;

const client = new Client({
  puppeteer: {
    restartOnAuthFail: true,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions'],
  },
  authStrategy: new LocalAuth({ dataPath: 'authSession' }),
});

client.on('qr', (qr) => (qrString = qr));
client.on('ready', () => (qrString = null));

// update status jika user sudah membaca pesan
client.on('message_ack', async (msg, ack) => {
  if (ack != 1) {
    try {
      await axios.post('http://localhost:8000/api/update-message-status', {
        message_id: msg.id._serialized,
        status: ack,
      });
    } catch (err) {
      console.error('Gagal update status ke Laravel:', err.message);
    }
  }
});

client.initialize();

module.exports = {
  client,
  MessageMedia,
  getQrString: () => qrString,
};
