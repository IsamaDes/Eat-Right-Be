import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors";
import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { UserRepository } from "../../repositories/userRepository";
import { NutritionistRepository } from "../../repositories/nutritionistRepository";
import { verifyNutritionistAccess } from "./nutritionAccess.service";
import { prisma } from "../../lib/prisma";


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


export const createMealPlanService = async (payload: any) => {
  const {
    clientId,
    nutritionistId,
    dateRangeStart,
    dateRangeEnd,
    numberOfWeeks,
    healthGoal,
    nutritionalRequirement,
    weeklyMealPlans,
  } = payload;

  const nutritionist = await prisma.user.findUnique({
    where: { id: nutritionistId },
    include: { nutritionistProfile: true },
  });

  if (!nutritionist?.nutritionistProfile) {
    throw new Error("Nutritionist profile not found");
  }

  const nutritionistProfileId = nutritionist.nutritionistProfile.id;

  if (!clientId) throw new Error("Client ID is required");
  if (!Array.isArray(weeklyMealPlans)) throw new Error("weeklyMealPlans must be an array");
  if (weeklyMealPlans.length === 0) throw new Error("weeklyMealPlans cannot be empty");
console.log(JSON.stringify(weeklyMealPlans, null, 2));

   const mealplan = await mealPlanRepository.create({
    clientId,
    nutritionistProfileId,
    dateRangeStart,
    dateRangeEnd,
    numberOfWeeks,
    healthGoal,
    nutritionalRequirement,
    weeklyMealPlans
  });
  return mealplan
};




// export const createMealPlanService = async (createMealPlanPayload: any) => {   

  

//   // Step 2: Extract data from frontend request
//   const {
//     clientId,
//     nutritionistId,
//     dateRangeStart,  
//     dateRangeEnd,
//     numberOfWeeks,
//     healthGoal,
//     nutritionalRequirement,
//     weeklyMealPlans,
//   } = createMealPlanPayload;


//   console.log("weeklyMealPlans received:", weeklyMealPlans);
//   const nutritionist = await prisma.user.findUnique({
//     where: { id: nutritionistId }, 
//     include: { nutritionistProfile: true }
//   });
  
//   if (!nutritionist || !nutritionist.nutritionistProfile) {
//     throw new Error("Nutritionist profile not found");
//   }
 
//   const nutritionistProfileId = nutritionist.nutritionistProfile.id;

//   // Step 3: Validate required fields
//   if (!clientId || !weeklyMealPlans || weeklyMealPlans.length === 0) {
//     throw new Error("Missing required meal plan information");
//   }

//   // Step 4: create and Save to database
//   const mealPlan = await mealPlanRepository.create({
  
//       dateRangeStart: new Date(dateRangeStart), 
//       dateRangeEnd: new Date(dateRangeEnd), 
//       numberOfWeeks,
//       healthGoal,
//       nutritionalRequirement,
//       client: {
//         connect: { id: clientId }
//       },
//       nutritionist: {
//         connect: { id: nutritionistProfileId }
//       },
//       weeklyMealPlans: {
//         create: weeklyMealPlans.map((week: any) => ({
//           weekNumber: week.weekNumber,
//           dailyPlans: {
//             create: week.dailyPlans.map((day: any) => ({
//               dayOfWeek: day.dayOfWeek,
//               meals: {
//                 create: day.meals.map((meal: any) => ({
//                   timeOfDay: meal.timeOfDay,
//                   typeOfMeal: meal.typeOfMeal,
//                   food: meal.food,
//                   nutritionalContent: meal.nutritionalContent
//                 }))
//               }
//             }))
//           }
//         }))
//       }
//   });
  
//   return mealPlan;
// };



export const deleteMealPlanService = async(userId: string, mealPlanId: string) => {
     await verifyNutritionistAccess(userId);
    const mealPlan = await mealPlanRepository.findById(mealPlanId);
    if(!mealPlan) throw new Error("Meal plan not found");
    return await mealPlanRepository.delete(mealPlanId)
}



