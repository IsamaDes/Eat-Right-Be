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
  async update(mealPlanId: string, updates: any) {
    return await MealPlan.findByIdAndUpdate(mealPlanId, updates, { new: true });
  },
async delete( mealPlanId: string){
    return await MealPlan.findByIdAndDelete(mealPlanId)
}
}
