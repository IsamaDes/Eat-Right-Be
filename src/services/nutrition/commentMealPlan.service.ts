import { BadRequestError } from "../../errors";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";


export const commentOnMealPlanService = async (text: string, mealPlanId: string, authorId: string) => {
  console.log("🧠 Commenting on meal:", mealPlanId);

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
   if (!mealPlan) throw new BadRequestError("Meal plan not found");
    const newComment = {text, mealPlanId, authorId, createdAt: new Date() }
    mealPlan?.comments.push(newComment);
 
  //refecth to get the comment details for frontend
   const savedMealPlan = await mealPlanRepository.save(mealPlan);
   return savedMealPlan;


 
}