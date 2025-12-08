// src/repositories/nutritionistRepository.ts
import { prisma } from "../lib/prisma";
import { UpdateNutritionistProfileInput } from "../utils/validators/UserValidator";

export const NutritionistRepository = {
    async createNutritionistUser(userId: string){
     return prisma.nutritionistProfile.create({data: {userId}})
    },

    async findClientsByNutritionistId(nutritionistId: string){
    return prisma.clientProfile.findMany({
        where: { assignedNutritionistId: nutritionistId },
        include: {
            user: true,
        }
    })
}, 

  async updateNutritionistProfile(userId: string, updates: Partial<UpdateNutritionistProfileInput>) {
    return prisma.nutritionistProfile.update({
      where: { userId },
      data: updates,
    });
  }
};
