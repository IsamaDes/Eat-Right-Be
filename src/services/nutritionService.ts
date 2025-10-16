import MealPlan, { IMealPlan } from "../models/MealPlan.js";
import User from "../models/User.js";

export const createMealPlanService = async (userId: string, data: any): Promise<IMealPlan> => {
  // Step 1: Verify the user exists and is an admin or nutritionist
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin" && user.role !== "nutritionist") {
    throw new Error("Access denied: only admins or nutritionists can create meal plans");
  }

  // Step 2: Extract data from frontend request
  const {
    clientId,
    clientName,
    dateRange,
    numberOfWeeks,
    healthGoal,
    nutritionalRequirement,
    weeklyMealPlans,
  } = data;

  // Step 3: Validate required fields
  if (!clientId || !weeklyMealPlans || weeklyMealPlans.length === 0) {
    throw new Error("Missing required meal plan information");
  }

  // Step 4: Save to database
  const mealPlan = await MealPlan.create({
    clientId,
    clientName,
    nutritionistName: user.name,
    dateRange,
    numberOfWeeks,
    healthGoal,
    nutritionalRequirement,
    weeklyMealPlans,
    createdAt: new Date(),
  });

  return mealPlan;
};

