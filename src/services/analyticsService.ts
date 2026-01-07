import { ClientAnalyticsResponse, Insight } from "../utils/clientAnalytics.contract";
import { getClientProfileService } from './adminService';
import { MealPlans, DailyPlan, Meal, ApiMealPlan, WeeklyMealPlan } from "../types/MealPlan";

/**
 * Fetch client analytics (summary, trends, insights)
 * @param clientId - ID of the client
 * @param range - '7d' | '30d'
 * @param include - Optional: ['weight', 'mood', 'insights']
 */
export async function getClientAnalyticsData(
  clientId: string,
  range: '7d' | '30d',
  include: string[] = []
): Promise<ClientAnalyticsResponse> {
  // 1. Fetch full client profile
  const res = await getClientProfileService(clientId);
  const profile = res.profile;

  if (!profile.mealPlans || profile.mealPlans.length === 0) {
    throw new Error("No meal plans found for client.");
  }

  // 2. Map API mealPlans to our MealPlan type (normalize dates)
  const mealPlans: MealPlans[] = profile.mealPlans.map((mp: ApiMealPlan) => ({
    id: mp.id,
    healthGoal: mp.healthGoal,
    dateRangeStart: mp.dateRangeStart instanceof Date ? mp.dateRangeStart.toISOString() : mp.dateRangeStart,
    dateRangeEnd: mp.dateRangeEnd instanceof Date ? mp.dateRangeEnd.toISOString() : mp.dateRangeEnd,
    weeklyMealPlans: mp.weeklyMealPlans
    
  }));

  // 3. Flatten all meals with real dates
 const allMeals: { date: string; meal: Meal }[] = [];

mealPlans.forEach(mealPlan => {
  const startDate = new Date(mealPlan.dateRangeStart);

  // Check that weeklyMealPlans exists and is an array
  mealPlan.weeklyMealPlans?.forEach((week: WeeklyMealPlan) => {
    week.dailyPlans.forEach((day: DailyPlan, index: number) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week.weekNumber - 1) * 7 + index);
      const isoDate = currentDate.toISOString();

      day.meals.forEach((meal: Meal) => {
        allMeals.push({ date: isoDate, meal });
      });
    });
  });
});


  // 4. Filter meals by range (7d or 30d)
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (range === '7d' ? 6 : 29));

  const filteredMeals = allMeals.filter(m => new Date(m.date) >= start && new Date(m.date) <= today);

  // 5. Dummy weight & mood data
  const dummyWeights = range === '7d'
    ? [{ date: today.toISOString(), weight: 70 }]
    : Array.from({ length: 4 }).map((_, i) => ({
        date: new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 70 + Math.floor(Math.random() * 5)
      }));

  const dummyMoods = filteredMeals.map(m => ({
    date: m.date,
    moodScore: Math.floor(Math.random() * 5) + 1,
    energyScore: Math.floor(Math.random() * 5) + 1
  }));

  const dailyCaloriesTarget =  2000;

  // 6. Compute summary
  const completedMealsCount = filteredMeals.length; // for dummy, assume all completed
  const plannedMealsCount = filteredMeals.length;

  const adherenceRate = plannedMealsCount ? Math.round((completedMealsCount / plannedMealsCount) * 100) : 0;
  const streak = completedMealsCount; // simple dummy: streak = all days

  const avgCalories = filteredMeals.length
    ? Math.round(filteredMeals.reduce((acc, m) => acc + (parseInt(m.meal.nutritionalContent) || 500), 0) / filteredMeals.length)
    : 0;

  const summary = { adherenceRate, avgCalories, streak, calorieDelta: 0 };

  // 7. Build trends
  const trends = {
    calories: {
      daily: filteredMeals.map(m => ({
        date: m.date,
        consumedCalories: parseInt(m.meal.nutritionalContent) || 500,
        targetCalories: dailyCaloriesTarget
      }))
    },
    weight: include.includes('weight') ? { weeklyAverage: dummyWeights } : undefined,
    mood: include.includes('mood') ? dummyMoods : undefined
  };

  // 8. Generate insights
  const insights: Insight[] | undefined = include.includes('insights')
    ? (() => {
        const list: Insight[] = [];

        // Example: missed breakfast (dummy)
        const missedBreakfast = filteredMeals.filter(m => m.meal.typeOfMeal === 'breakfast' && Math.random() < 0.3);
        if (missedBreakfast.length >= 2) {
          list.push({
            id: 'missed-breakfast',
            type: 'warning',
            title: 'Skipped breakfasts',
            description: `You missed breakfast on ${missedBreakfast.length} days this period.`,
            recommendation: 'Prepare a quick grab-and-go breakfast on Sunday night.',
            confidence: 0.8
          });
        }

        // Example: late dinners (dummy)
        const lateDinners = filteredMeals.filter(m => m.meal.typeOfMeal === 'dinner' && Math.random() < 0.3);
        if (lateDinners.length >= 2) {
          list.push({
            id: 'late-dinner-calories',
            type: 'neutral',
            title: 'Late dinners detected',
            description: 'Late dinners were associated with higher calorie intake.',
            recommendation: 'Try eating dinner before 8pm when possible.',
            confidence: 0.75
          });
        }

        return list.length ? list : undefined;
      })()
    : undefined;

  // 9. Construct response
  const response: ClientAnalyticsResponse = {
    meta: {
      range,
      startDate: filteredMeals[0]?.date || start.toISOString(),
      endDate: filteredMeals[filteredMeals.length - 1]?.date || today.toISOString()
    },
    summary,
    trends,
    insights
  };

  return response;
}
