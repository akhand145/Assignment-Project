const db = require('../config/database');
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deviceToken: {
      type: String
    },
    jwtToken: {
      type: String
    },
    deviceId: {
      type: String
    },
    deviceType: {
      type: String
    }
  },
  {
    collection: 'Session',
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Session', sessionSchema);
