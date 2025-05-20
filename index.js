const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sp23bsse0054:1234@cluster0.u1zfo.mongodb.net/userdb')
  .then(() => console.log('✅ Order DB connected'))
  .catch(err => console.error('❌ DB error:', err));

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Order service running on http://localhost:${PORT}`);
});