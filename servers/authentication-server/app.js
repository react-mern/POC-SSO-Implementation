const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);

module.exports = app;
