import mongoose, { Schema } from "mongoose";


const appointmentSchema = new mongoose.Schema({
  date: Date,
  doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }, 
  notes: {type: String, default: null},
  status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    });

export default mongoose.model("appointment", appointmentSchema)