import { getMealPlansService, getNutritionistClients, getNutritionistProfileService } from './NutrionistService';

const NutritionistDashboardService = async(nutritionistId: string) => {
    const profile = await getNutritionistProfileService(nutritionistId);
    const clients = await getNutritionistClients(nutritionistId);
    const mealPlansResult = await getMealPlansService(nutritionistId, {});
    const mealPlans = mealPlansResult.data;

  return {
    profile,
    clients,
    mealPlans,
    stats: {
      totalClients: clients.length,
      totalMealPlans: mealPlans.length,
  },
}
}

export default NutritionistDashboardService