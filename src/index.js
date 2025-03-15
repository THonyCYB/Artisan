require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 1000,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Database connection
const { MongoMemoryServer } = require('mongodb-memory-server');

// Create MongoDB Memory Server instance
const initializeDatabase = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Memory Server');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

initializeDatabase();

// Serve static files from public directory
app.use(express.static('public'));

// Handle SPA routing - send index.html for all routes except /api
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile('index.html', { root: 'public' });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});