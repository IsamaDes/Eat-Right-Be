import { UserRepository } from '../../repositories/userRepository';

export const verifyNutritionistAccess = async(userId: string) => {
   const user = await UserRepository.findById(userId);
  if (user.role !== "ADMIN" && user.role !== "NUTRITIONIST") {
    throw new Error("Access denied: only admins or nutritionists can manage meal plans");
  }
  return user
}

