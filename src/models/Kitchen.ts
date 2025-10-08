import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    number_of_chefs: { type: Number, default: 0 },
    available_meal: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AvailableMeal" },
    ],
    client_meal: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Kitchen", kitchenSchema);
