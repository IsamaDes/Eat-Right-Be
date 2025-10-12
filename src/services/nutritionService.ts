const FoodMenu = require("../models/FoodMenu");
const User = require("../models/User");

/**
 * Basic sanitization — prevents simple injection patterns
 */
const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    // Remove $ operators and dots (Mongo injection)
    return input.replace(/\$/g, "").replace(/\./g, "");
  }
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (typeof input === "object" && input !== null) {
    const cleanObj: Record<string, any> = {};
    for (const key in input) {
      cleanObj[sanitizeInput(key)]  = sanitizeInput(input[key]);
    }
    return cleanObj;
  }
  return input;
};

/**
 * Simple input validation for meal plans
 */
const validateMealPlanInput = (data: any) => {
  const errors = [];

  if (!data.date_range || typeof data.date_range !== "string") {
    errors.push("Date range must be a valid string");
  }

  if (!Array.isArray(data.meal_plan) || data.meal_plan.length === 0) {
    errors.push("Meal plan must include at least one week");
  } else {
    data.meal_plan.forEach((week: any, i: any) => {
      if (!Array.isArray(week.meal) || week.meal.length === 0) {
        errors.push(`Week ${i + 1} must include at least one meal`);
      } else {
        week.meal.forEach((m: any, j: any) => {
          if (!m.meal_name || typeof m.meal_name !== "string")
            errors.push(`Meal name missing in week ${i + 1}, meal ${j + 1}`);
          if (typeof m.calories !== "number" || m.calories <= 0)
            errors.push(`Calories must be a positive number for meal ${j + 1}`);
        });
      }
    });
  }

  return errors;
};

/**
 * Creates a meal plan for a nutritionist
 */
const createMealPlan = async (userId: any, mealData: any) => {
  // Check user role
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "nutritionist")
    throw new Error("Access denied. Only nutritionists can create meal plans.");

  // Sanitize input
  const sanitizedData = sanitizeInput(mealData);

  // Validate input
  const validationErrors = validateMealPlanInput(sanitizedData);
  if (validationErrors.length > 0)
    throw new Error(`Validation failed: ${validationErrors.join(", ")}`);

  // Create and save meal plan
  const newMealPlan = new FoodMenu({
    date_range: sanitizedData.date_range,
    Nutritionist: user._id,
    weeks: sanitizedData.meal_plan.length,
    meal_plan: sanitizedData.meal_plan,
  });

  await newMealPlan.save();

  return newMealPlan;
};

module.exports = { createMealPlan };
