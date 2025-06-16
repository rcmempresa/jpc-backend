// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serviceRoutes = require('./routes/serviceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
require('dotenv').config();

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: 'https://www.jpcr.pt',
  credentials: true, 
}));

//console.log("olá");
app.use(express.json());

// Rota de teste simples
app.use('/api/servicos', serviceRoutes);
app.use('/api/contacto', contactRoutes );
app.use('/api/candidatura',candidaturaRoutes);
app.use('/api/rentals',rentalRoutes);
app.get('/', (req, res) => {
  res.send("Está a funcionar corretamente");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
