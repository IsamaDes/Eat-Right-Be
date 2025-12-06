import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    message_type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
