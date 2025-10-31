import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "./nutritionAccess.service";

// Update Meal Plan
export const updateMealPlanService = async (userId: string, mealPlanId: string, updates: any) => {
 const user = await verifyNutritionistAccess(userId)

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
  if (!mealPlan) throw new Error("Meal plan not found");

  // nutritionist can only edit their own created plans
  if (user.role === "nutritionist" && mealPlan.nutritionistName !== user.name) {
    throw new Error("You can only update your own meal plans");
  }

  const updateMealPlan = mealPlanRepository.update(mealPlanId, updates)

  return updateMealPlan;
};
