import { updateMealPlanService } from "../../../src/services/nutrition/updateMealPlan.service";
import { mealPlanRepository } from "../../../src/repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "../../../src/services/nutrition/nutritionAccess.service";

jest.mock("../../../src/repositories/mealPlanRepository");
jest.mock("../../../src/services/nutrition/nutritionAccess.service");

describe("updateMealPlanService", () => {
  const mockVerifyAccess = verifyNutritionistAccess as jest.Mock;
  const mockFindById = mealPlanRepository.findById as jest.Mock;
  const mockUpdate = mealPlanRepository.update as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  Admin updates a meal plan successfully
  test("should allow admin to update any meal plan", async () => {
    const userId = "admin123";
    const mealPlanId = "plan001";
    const updates = { healthGoal: "Weight Gain" };

    mockVerifyAccess.mockResolvedValue({ _id: userId, role: "admin", name: "Admin" });
    mockFindById.mockResolvedValue({ id: mealPlanId, nutritionistName: "Dr. Jane" });
    mockUpdate.mockResolvedValue({ id: mealPlanId, healthGoal: "Weight Gain" });

    const result = await updateMealPlanService(userId, mealPlanId, updates);

    expect(mockVerifyAccess).toHaveBeenCalledWith(userId);
    expect(mockFindById).toHaveBeenCalledWith(mealPlanId);
    expect(mockUpdate).toHaveBeenCalledWith(mealPlanId, updates);
    expect(result?.healthGoal).toBe("Weight Gain");
  });

  // Nutritionist updates their own meal plan successfully
  test("should allow nutritionist to update their own meal plan", async () => {
    const userId = "nutri001";
    const mealPlanId = "plan002";
    const updates = { nutritionalRequirement: "High Protein" };

    mockVerifyAccess.mockResolvedValue({ _id: userId, role: "nutritionist", name: "Dr. Nutri" });
    mockFindById.mockResolvedValue({ id: mealPlanId, nutritionistName: "Dr. Nutri" });
    mockUpdate.mockResolvedValue({ id: mealPlanId, nutritionalRequirement: "High Protein" });

    const result = await updateMealPlanService(userId, mealPlanId, updates);

    expect(mockFindById).toHaveBeenCalledWith(mealPlanId);
    expect(result?.nutritionalRequirement).toBe("High Protein");
  });

  // Should throw error if meal plan not found
  test("should throw an error when meal plan is not found", async () => {
    const userId = "admin001";
    const mealPlanId = "unknown";
    const updates = { healthGoal: "Cardio" };

    mockVerifyAccess.mockResolvedValue({ _id: userId, role: "admin", name: "Admin" });
    mockFindById.mockResolvedValue(null);

    await expect(updateMealPlanService(userId, mealPlanId, updates))
      .rejects.toThrow("Meal plan not found");

    expect(mockFindById).toHaveBeenCalledWith(mealPlanId);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // Should throw error if nutritionist tries to update someone else’s plan
  test("should throw error if nutritionist tries to update another nutritionist’s plan", async () => {
    const userId = "nutri002";
    const mealPlanId = "plan004";
    const updates = { healthGoal: "Detox" };

    mockVerifyAccess.mockResolvedValue({ _id: userId, role: "nutritionist", name: "Dr. NutriB" });
    mockFindById.mockResolvedValue({ id: mealPlanId, nutritionistName: "Dr. NutriA" });

    await expect(updateMealPlanService(userId, mealPlanId, updates))
      .rejects.toThrow("You can only update your own meal plans");

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // Should call verifyNutritionistAccess with correct user ID
  test("should call verifyNutritionistAccess with user ID", async () => {
    const userId = "adminX";
    const mealPlanId = "plan005";
    const updates = { healthGoal: "Balanced Diet" };

    mockVerifyAccess.mockResolvedValue({ _id: userId, role: "admin", name: "Admin X" });
    mockFindById.mockResolvedValue({ id: mealPlanId, nutritionistName: "Dr. Nutri" });
    mockUpdate.mockResolvedValue({ id: mealPlanId, healthGoal: "Balanced Diet" });

    await updateMealPlanService(userId, mealPlanId, updates);

    expect(mockVerifyAccess).toHaveBeenCalledTimes(1);
    expect(mockVerifyAccess).toHaveBeenCalledWith(userId);
  });
});
