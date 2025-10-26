import { IMealPlan } from "../../models/MealPlan.js";
import { mealPlanRepository } from "../../repositories/mealPlanRepository.js";
import { UserRepository } from "../../repositories/userRepository.js";


export const getMealPlansService = async (userId: string, filters: any = {}) => {
  const user = await UserRepository.findById(userId);

  // Admins see all; doctor see only their own; patients see their plans
  const query: any = {};
  if (user.role === "nutritionist") {
    query.doctorName = user.name;
  } else if (user.role === "client") {
    query.patientId = user._id;
  }

  if (filters.patientName) query.patientName = { $regex: filters.patientName, $options: "i" };

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