// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
const winston = require('./utils/logger');
const authMiddleware = require('./middleware/authMiddleware');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(authMiddleware);

// Routes
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  winston.error(err.message);
  res.status(statusCode).json({ message: err.message });
});

// Database connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    winston.info('Connected to MongoDB');
    app.listen(PORT, () => {
      winston.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    winston.error('Database connection error:', err);
  });
