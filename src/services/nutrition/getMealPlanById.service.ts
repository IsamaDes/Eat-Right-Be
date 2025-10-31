import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { UserRepository } from "../../repositories/userRepository";


// Get Single Meal Plan by ID
export const getMealPlanByIdService = async (userId: string, mealPlanId: string) => {
  const user = await UserRepository.findById(userId);

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
  if (!mealPlan) throw new Error("Meal plan not found");

  // Access control logic
  if (user.role === "client" && String(mealPlan.clientId) !== String(user._id)) {
    throw new Error("Access denied: you can only view your own meal plans");
  }

  if (user.role === "nutritionist" && mealPlan.nutritionistName !== user.name) {
    throw new Error("Access denied: you can only view meal plans you created");
  }

  return mealPlan;
};