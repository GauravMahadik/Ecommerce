const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();

// Timeout for image uploads
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    res.status(408).json({ message: 'Request timeout' });
  });
  next();
});

app.use(cors({
  origin: [
    'https://ecommerce-frontend-tau-bice.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Express error handler
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});