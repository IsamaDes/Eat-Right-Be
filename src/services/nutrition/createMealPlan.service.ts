import { MealPlan } from "../../models/MealPlan";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "./nutritionAccess.service";

export const createMealPlanService = async (userId: string, data: any) => {
  // Step 1: Verify the user exists and is an admin or nutritionist
    const user = await verifyNutritionistAccess(userId);

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

  // Step 4: create and Save to database
  const mealPlan = await mealPlanRepository.create({
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
