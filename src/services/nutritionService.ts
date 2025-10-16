import MealPlan, { IMealPlan } from "../models/MealPlan.js";
import User from "../models/User.js";

export const createMealPlanService = async (userId: string, data: any): Promise<IMealPlan> => {
  // Step 1: Verify the user exists and is an admin or nutritionist
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin" && user.role !== "nutritionist") {
    throw new Error("Access denied: only admins or nutritionists can create meal plans");
  }

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

  // Step 4: Save to database
  const mealPlan = await MealPlan.create({
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


export const getMealPlansService = async (userId: string, filters: any = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Admins see all; nutritionists see only their own; clients see their plans
  const query: any = {};
  if (user.role === "nutritionist") {
    query.nutritionistName = user.name;
  } else if (user.role === "client") {
    query.clientId = user._id;
  }

  if (filters.clientName) query.clientName = { $regex: filters.clientName, $options: "i" };

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const [mealPlans, total] = await Promise.all([
    MealPlan.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    MealPlan.countDocuments(query),
  ]);

  return {
    data: mealPlans,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update Meal Plan
export const updateMealPlanService = async (userId: string, mealPlanId: string, updates: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin" && user.role !== "nutritionist") {
    throw new Error("Access denied: only admins or nutritionists can update meal plans");
  }

  const mealPlan = await MealPlan.findById(mealPlanId);
  if (!mealPlan) throw new Error("Meal plan not found");

  // Optionally, nutritionist can only edit their own created plans
  if (user.role === "nutritionist" && mealPlan.nutritionistName !== user.name) {
    throw new Error("You can only update your own meal plans");
  }

  Object.assign(mealPlan, updates);
  await mealPlan.save();

  return mealPlan;
};
