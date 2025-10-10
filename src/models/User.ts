import mongoosePkg = require("mongoose"); 
const mongoose = mongoosePkg;

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String,   enum: ["client", "nutritionist", "admin"], required: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  healthHistory: [{ type: String, default: [] }],
  wellness_goal: { type: String, default: null },
  tokenHash: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
