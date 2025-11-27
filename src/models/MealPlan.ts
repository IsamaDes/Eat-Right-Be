import mongoose, { Schema, Document } from "mongoose";

interface MealContent {
  timeOfDay: string; 
  typeOfMeal: "breakfast" | "lunch" | "dinner";
  food: string;
  nutritionalContent: string;
}

interface DailyMealPlan {
  dayOfWeek: string; 
  meals: MealContent[];
}

interface WeeklyMealPlan {
  weekNumber: number;
  dailyPlans: DailyMealPlan[];
}

interface Comment {
text: string;
mealPlanId: string;
authorId: string;
createdAt: Date;
}

export interface IMealPlan extends Document {
  clientName: string;
  nutritionistName: string;
  clientId: mongoose.Types.ObjectId;
  createdAt: Date;
  dateRange: { start: Date; end: Date };
  numberOfWeeks: number;
  healthGoal: string;
  nutritionalRequirement: string;
  weeklyMealPlans: WeeklyMealPlan[];
  comments: Comment[];
}

const mealPlanSchema = new Schema<IMealPlan>(
  {
    clientName: { type: String, required: true },
    nutritionistName: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    numberOfWeeks: { type: Number, required: true },
    healthGoal: { type: String, required: true },
    nutritionalRequirement: { type: String, required: true },
    weeklyMealPlans: [
      {
        weekNumber: { type: Number, required: true },
        dailyPlans: [
          {
            dayOfWeek: { type: String, required: true },
            meals: [
              {
                timeOfDay: { type: String, required: true },
                typeOfMeal: {
                  type: String,
                  enum: ["breakfast", "lunch", "dinner"],
                  required: true,
                },
                food: { type: String, required: true },
                nutritionalContent: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
     comments: [
      {
        text: String,
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  { timestamps: true }
);

const MealPlan = mongoose.model<IMealPlan>("MealPlan", mealPlanSchema);
export default MealPlan;
