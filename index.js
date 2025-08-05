require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:8000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true
}));

const whatsappRouter = require('./routes.js');
app.use('/', whatsappRouter);

app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
