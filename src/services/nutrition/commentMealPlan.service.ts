import { BadRequestError } from "../../errors";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";


export const commentOnMealPlanService = async (data: {text: string, mealPlanId: string, userId: string}) => {
  console.log("Commenting on meal:", data.mealPlanId);

  const mealPlan = await mealPlanRepository.findById(data.mealPlanId);
   if (!mealPlan) throw new BadRequestError("Meal plan not found");
   const newComment = await mealPlanRepository.comment(data);
 
  return newComment;
 
}