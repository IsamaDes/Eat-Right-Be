import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String,   enum: ["client", "nutritionist", "admin"], required: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  healthHistory: [{ type: String, default: [] }],
  assignedNutritionist: { type: Schema.Types.ObjectId, ref: "User", default: null },
  wellness_goal: { type: String, default: null },
  meal_plans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" }],
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  refreshToken: { type: String },
  tokenHash: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
