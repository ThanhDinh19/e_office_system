const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');

const app = express();

/* ========== GLOBAL MIDDLEWARE ========== */

// Cho phép frontend gọi API
app.use(cors());

// Parse JSON body
app.use(express.json());

// Log request (dev)
app.use(morgan('dev'));

app.use('/api', routes);

app.use('/public', express.static(path.join(__dirname, '../public')));

/* ========== HEALTH CHECK ========== */

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});


// ví dụ test
app.get('/api/test', (req, res) => {
  res.json({ message: 'E-Office API is running' });
});

/* ========== 404 HANDLER ========== */

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

/* ========== ERROR HANDLER ========== */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
  });
});

module.exports = app;
