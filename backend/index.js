const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const parentRoutes = require('./routes/parent');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('PassPort API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { prisma };
