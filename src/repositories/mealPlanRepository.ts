import MealPlan from "../models/MealPlan";

export const mealPlanRepository = {

async create(mealPlanData: any){
    const mealPlan = new MealPlan(mealPlanData);
    return await mealPlan.save();
},

async save(mealPlan: any){
    return await mealPlan.save()
},

async findById(mealPlanId: string){
    return await MealPlan.findById(mealPlanId);
},

async findByClientId(clientId: string){
    return await MealPlan.findById({clientId}).populate("clientId");
},

 async count(query: any) {
    return await MealPlan.countDocuments(query);
  },

async getFiltered(query: any, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const mealPlans = await MealPlan.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await MealPlan.countDocuments(query);

    return {
      mealPlans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

async update(mealPlanId: string, updates: any) {
    return await MealPlan.findByIdAndUpdate(mealPlanId, updates, { new: true });
  },
async delete( mealPlanId: string){
    return await MealPlan.findByIdAndDelete(mealPlanId)
}
}
