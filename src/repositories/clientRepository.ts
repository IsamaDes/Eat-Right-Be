// src/repositories/clientRepository.ts
import { prisma } from "../lib/prisma";
import { UpdateClientProfileInput } from "../utils/validators/UserValidator";

export const ClientRepository = {
  async createClientProfile(userId: string, tx: any) {
    return tx.clientProfile.create({
      data: { userId },
      include: {
        user: true, 
    },
    });
    
  },

 async getClientProfile(userId: string) {
  return prisma.clientProfile.findUnique({
    where: { userId },
    include: {
      assignedNutritionist: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      subscription: true,
      mealPlans: true,
      user: true
    }
  });
},

  async updateClientProfile(userId: string, updates: Partial<UpdateClientProfileInput>) {
    return prisma.clientProfile.update({
      where: { userId },
      data: updates,
    });
  },

  async findClientByUserId(subscriberId: string){
   return prisma.clientProfile.findUnique({
    where: {id: subscriberId},
    include: { subscription: true }
  })
  },


  async findClientsByNutritionist(nutritionistId: string) {
    return prisma.clientProfile.findMany({
      where: { assignedNutritionistId: nutritionistId },
      include: { user: true },
    });
  },


};


