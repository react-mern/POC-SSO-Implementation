const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  provider: {type: String, required: true},
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expires after 1 hour
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;