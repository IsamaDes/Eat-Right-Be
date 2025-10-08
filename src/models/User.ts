import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  age: { type: Number },
  healthHistory: [{ type: String }],
  wellness_goal: { type: String },
  tokenHash: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("User", userSchema);
