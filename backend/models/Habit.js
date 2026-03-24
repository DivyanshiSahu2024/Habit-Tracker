// backend/models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  colorCode: { type: String },
  frequency: { type: String },
  completedDates: [{ type: String }] 
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);