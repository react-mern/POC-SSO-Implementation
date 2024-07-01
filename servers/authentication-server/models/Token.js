const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  refreshToken: { type: String },
  provider: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
