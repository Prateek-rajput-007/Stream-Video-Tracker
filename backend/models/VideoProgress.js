const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: String, required: true },
  intervals: [[Number]], // Array of [start, end] intervals
  progress: { type: Number, default: 0 }, // Percentage
  lastPosition: { type: Number, default: 0 }, // Last watched position
});

module.exports = mongoose.model('VideoProgress', videoProgressSchema);