import { mealPlanRepository } from "../../repositories/mealPlanRepository";
import { UserRepository } from "../../repositories/userRepository";


export const getMealPlansService = async (userId: string, filters: any = {}) => {
  const user = await UserRepository.findById(userId);

  // Admins see all; nutritionist see only their own; clients see their plans
  const query: any = {};
  if (user.role === "NUTRITIONIST") {
    query.nutritionistName = user.name;
  } else if (user.role === "CLIENT") {
    query.clientId = user.id;
  }

  if (filters.clientName) query.clientName = { $regex: filters.clientName, $options: "i" };

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