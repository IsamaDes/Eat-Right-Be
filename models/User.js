const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4 },
  name: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  tokenHash: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", UserSchema);
