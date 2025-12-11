// src/repositories/nutritionistRepository.ts
import { prisma } from "../lib/prisma";
import { UpdateNutritionistProfileInput } from "../utils/validators/UserValidator";


export const NutritionistRepository = {
    async createNutritionistUser(userId: string, tx: any){
  return tx.nutritionistProfile.create({
      data: { userId },
      include: { user: true },
    });
    },

    async findClientsByNutritionistId(nutritionistId: string){
    return prisma.clientProfile.findMany({
        where: { assignedNutritionistId: nutritionistId },
        include: {
            user: true,
        }
    })
}, 


  async getNutritionistProfile(userId: string){
   const user = await prisma.user.findUnique({
         where: { id: userId },
         include: {
          nutritionistProfile: true,
        },
    })
    if (!user) return null;
     return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.nutritionistProfile,
  };
  },

  async updateNutritionistProfile(userId: string, updates: Partial<UpdateNutritionistProfileInput>) {
    return prisma.nutritionistProfile.update({
      where: { userId },
      data: updates,
    });
  }
};
