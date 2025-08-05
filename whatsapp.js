const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

let qrString = null;

const client = new Client({
  puppeteer: {
    restartOnAuthFail: true,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions'],
  },
  authStrategy: new LocalAuth({ dataPath: 'authSession' }),
});

client.on('qr', (qr) => qrString = qr);
client.on('ready', () => qrString = null);

client.initialize();

module.exports = {
  client,
  MessageMedia,
  getQrString: () => qrString,
};
