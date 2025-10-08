import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
