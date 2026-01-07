import { mealPlanRepository } from "../repositories/mealPlanRepository";
import { prisma } from "../lib/prisma";


export const clientService = {
  async getClientMealPlans(clientId: string) {
   
  const client = await prisma.user.findUnique({
  where: { id: clientId },
  include: {
    clientProfile: {
      include: {
        mealPlans: {
          include: {
            weeklyMealPlans: {
              include: {
                dailyPlans: {
                  include: {
                    meals: {
                      include: {
                        dailyMealPlan: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

    
      if (!client?.clientProfile) {
        throw new Error("clientprofile profile not found");
      }
    return client
  }
};