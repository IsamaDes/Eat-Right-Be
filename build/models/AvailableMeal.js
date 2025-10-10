import mongoose from "mongoose";
const availableMealSchema = new mongoose.Schema({
    chef_name: { type: String },
    meal_name: { type: String, required: true },
    nutrition_info: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
    },
}, { timestamps: true });
export default mongoose.model("AvailableMeal", availableMealSchema);
