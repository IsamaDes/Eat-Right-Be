import { prisma } from "../lib/prisma";

export type CreateCommentInput = {
  text: string;
  mealPlanId: string;
  userId: string;
};

export const mealPlanRepository = {
 
  async create(mealPlanData: any) {
    return prisma.mealPlan.create({
      data: mealPlanData,
    });
  },

  async comment(input: CreateCommentInput){
     return prisma.mealPlanComment.create({
      data: input
     })
  },
  
  async save(mealPlan: any) {
    return prisma.mealPlan.update({
      where: { id: mealPlan.id },
      data: mealPlan,
    });
  },

 
  async findById(mealPlanId: string) {
    return prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        client: true,
        nutritionist: true,
        weeklyMealPlans: { include: { dailyPlans: { include: { meals: true } } } },
        comments: true,
      },
    });
  },

  async findByClientId(clientId: string) {
    return prisma.mealPlan.findMany({
      where: { clientId },
      include: {
        client: true,
        nutritionist: true,
        weeklyMealPlans: { include: { dailyPlans: { include: { meals: true } } } },
        comments: true,
      },
    });
  },

  async count(query: any) {
    return prisma.mealPlan.count({ where: query });
  },

  async getFiltered(nutritionistId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const mealPlans = await prisma.mealPlan.findMany({
      where: {nutritionistId},
      include: {
        client: true,
        nutritionist: true,
        weeklyMealPlans: { include: { dailyPlans: { include: { meals: true } } } },
        comments: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.mealPlan.count({  where: {nutritionistId: nutritionistId,}});

    return {
      mealPlans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async update(mealPlanId: string, updates: any) {
    return prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: updates,
    });
  },

  async delete(mealPlanId: string) {
    return prisma.mealPlan.delete({
      where: { id: mealPlanId },
    });
  },
};
