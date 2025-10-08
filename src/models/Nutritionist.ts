import mongoose from "mongoose";

const nutritionistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    years_of_experience: { type: Number, required: true },
    age: { type: Number },
    qualification: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Nutritionist", nutritionistSchema);
