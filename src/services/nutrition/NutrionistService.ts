import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { UserRepository } from "../../repositories/userRepository";
import { NutritionistRepository } from "../../repositories/nutritionistRepository";
import { verifyNutritionistAccess } from "./nutritionAccess.service";


export type UpdateNutritionistProfileInput = {
  certification?:  String;
  experienceYears?: Number;
};

export const getNutritionistProfileService = async(nutritionistId: string) => {
  const nutritionist = await NutritionistRepository.getNutritionistProfile(nutritionistId);
  return nutritionist;
}

export const getNutritionistClients = async(nutritionistId: string) => {
   const clients = await NutritionistRepository.findClientsByNutritionistId(nutritionistId);
   return clients;
}

export const commentOnMealPlanService = async (data: {text: string, mealPlanId: string, userId: string}) => {
  console.log("Commenting on meal:", data.mealPlanId);

  const mealPlan = await mealPlanRepository.findById(data.mealPlanId);
   if (!mealPlan) throw new BadRequestError("Meal plan not found");
   const newComment = await mealPlanRepository.comment(data);
 
  return newComment;
 
}


// Update Meal Plan
export const updateMealPlanService = async (userId: string, mealPlanId: string, updates: any) => {
 const user = await verifyNutritionistAccess(userId)

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
  if (!mealPlan) throw new Error("Meal plan not found");

  // nutritionist can only edit their own created plans
  if (user.role === "NUTRITIONIST" && mealPlan.nutritionistId !== user.id) {
    throw new Error("You can only update your own meal plans");
  }

  const updateMealPlan = mealPlanRepository.update(mealPlanId, updates)

  return updateMealPlan;
};



export const getMealPlansService = async (userId: string, filters: any = {}) => {
  const user = await UserRepository.findById(userId);
  const query = user.id
  // Admins see all; nutritionist see only their own; clients see their plans

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  const {mealPlans, total, totalPages} = await mealPlanRepository.getFiltered(query, page, limit);

  return {
    data: mealPlans,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};




// Get Single Meal Plan by ID
export const getMealPlanByIdService = async (userId: string, mealPlanId: string) => {
  const user = await UserRepository.findById(userId);

  const mealPlan = await mealPlanRepository.findById(mealPlanId);
  if (!mealPlan) throw new NotFoundError("Meal plan not found");

  // Access control logic
  if (user.role === "CLIENT" && mealPlan.clientId !== user.id) {
    throw new UnauthorizedError("Access denied: you can only view your own meal plans");
  }

  if (user.role === "NUTRITIONIST" && mealPlan.nutritionistId !== user.id) {
    throw new UnauthorizedError("Access denied: you can only view meal plans you created");
  }

  return mealPlan;
}

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



export const deleteMealPlanService = async(userId: string, mealPlanId: string) => {
     await verifyNutritionistAccess(userId);
    const mealPlan = await mealPlanRepository.findById(mealPlanId);
    if(!mealPlan) throw new Error("Meal plan not found");
    return await mealPlanRepository.delete(mealPlanId)
}



