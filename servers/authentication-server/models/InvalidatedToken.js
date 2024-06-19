const mongoose = require("mongoose");

const invalidatedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, sparse: true },

  // Timestamp when the token was added, set to automatically expire after 1 day
  addedAt: { type: Date, default: Date.now, expires: "1d" },
});

const InvalidatedToken = mongoose.model(
  "InvalidatedToken",
  invalidatedTokenSchema
);
module.exports = InvalidatedToken;
