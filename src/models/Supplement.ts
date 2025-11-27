import mongoose from "mongoose";

const SupplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupplementCategory",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Supplement", SupplementSchema);
