import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { UserRepository } from "../../repositories/userRepository";


// Get Single Meal Plan by ID
export const getMealPlanByIdService = async (userId: string, mealPlanId: string) => {
  const user = await UserRepository.findById(userId);

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
  if (!mealPlan) throw new NotFoundError("Meal plan not found");

  // Access control logic
  if (user.role === "client" && mealPlan.clientId !== user.id) {
    throw new UnauthorizedError("Access denied: you can only view your own meal plans");
  }

  if (user.role === "nutritionist" && mealPlan.nutritionistId !== user.id) {
    throw new UnauthorizedError("Access denied: you can only view meal plans you created");
  }

  return mealPlan;
};