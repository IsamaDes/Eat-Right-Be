import mongoosePkg = require("mongoose"); 
const mongoose = mongoosePkg;

const availableMealSchema = new mongoose.Schema(
  {
    chef_name: { type: String },
    meal_name: { type: String, required: true },
    nutrition_info: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvailableMeal", availableMealSchema);

