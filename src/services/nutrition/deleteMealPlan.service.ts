
import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "./nutritionAccess.service";

export const deleteMealPlanService = async(userId: string, mealPlanId: string) => {
     await verifyNutritionistAccess(userId);
    const mealPlan = await mealPlanRepository.findById(mealPlanId);
    if(!mealPlan) throw new Error("Meal plan not found");
    return await mealPlanRepository.delete(mealPlanId)
}