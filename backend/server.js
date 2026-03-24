// 1. Import our tools
require('dotenv').config();
console.log("Checking for Secret:", process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
 // Loads our hidden environment variables

// 2. Initialize the Express app
const app = express();

// 3. Set up middleware (The rules for our server)
app.use(cors()); // Allow requests from our React app
app.use(express.json()); // Allow our server to understand JSON data from React

const habitRoutes = require('./routes/habitRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 5. Start listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});