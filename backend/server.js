require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const recRoutes = require('./routes/recRoutes');
const restRoutes = require('./routes/restRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/recommend', recRoutes);
app.use('/api/restaurants', restRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);