

export interface Meal {
  id: string;
  typeOfMeal: 'breakfast' | 'lunch' | 'dinner';
  food: string;
  timeOfDay: string;
  nutritionalContent: string;
}

export interface DailyPlan {
  id: string;
  dayOfWeek: string;
  meals: Meal[];
}

export interface WeeklyMealPlan {
  id: string;
  weekNumber: number;
  dailyPlans: DailyPlan[];
}

export interface MealPlans {
  id: string;
  healthGoal: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  weeklyMealPlans?: WeeklyMealPlan[];
}


export interface ApiMealPlan {
  id: string;
  healthGoal: string;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  weeklyMealPlans?: WeeklyMealPlan[]; 
}