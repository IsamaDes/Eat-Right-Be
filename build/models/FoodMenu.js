import mongoose from "mongoose";
import Nutritionist from "./User";
const foodMenuSchema = new mongoose.Schema({
    date_created: { type: Date, default: Date.now },
    date_range: { type: String },
    Nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: Nutritionist },
    weeks: { types: Number },
    meal_plan: [
        {
            meal: [
                {
                    date: String,
                    day: String,
                    time: String,
                    meal: String, //breakfast||lunch||dinner
                    meal_name: String,
                    ingredients: [String],
                    calories: Number,
                },
            ],
        },
    ],
});
export default mongoose.model("FoodMenu", foodMenuSchema);
