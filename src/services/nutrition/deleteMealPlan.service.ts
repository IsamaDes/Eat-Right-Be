
import { mealPlanRepository } from "../../repositories/mealPlanRepository.js";
import { verifyNutritionistAccess } from "./nutritionAccess.service.js";

export const deleteMealPlanService = async(userId: string, mealPlanId: string) => {
    const user = await verifyNutritionistAccess(userId);
    const mealPlan = await mealPlanRepository.findById(mealPlanId);
    if(!mealPlan) throw new Error("Meal plan not found");
    return await mealPlanRepository.delete(mealPlanId)
}