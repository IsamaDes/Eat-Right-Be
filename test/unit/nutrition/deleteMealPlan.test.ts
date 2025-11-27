import { deleteMealPlanService } from "../../../src/services/nutrition/deleteMealPlan.service";
import { mealPlanRepository } from "../../../src/repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "../../../src/services/nutrition/nutritionAccess.service";

// Mock dependencies
jest.mock("../../../src/repositories/mealPlanRepository");
jest.mock("../../../src/services/nutrition/nutritionAccess.service");

describe("deleteMealPlanService", () => {
  const mockVerifyAccess = verifyNutritionistAccess as jest.Mock;
  const mockFindById = mealPlanRepository.findById as jest.Mock;
  const mockDelete = mealPlanRepository.delete as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SUCCESS: Authorized user deletes existing meal plan
  test("should delete a meal plan successfully when user has access", async () => {
    const userId = "nutritionist123";
    const mealPlanId = "plan001";

    mockVerifyAccess.mockResolvedValue({ id: userId, role: "nutritionist" });
    mockFindById.mockResolvedValue({ id: mealPlanId });
    mockDelete.mockResolvedValue({ success: true });

    const result = await deleteMealPlanService(userId, mealPlanId);

    expect(mockVerifyAccess).toHaveBeenCalledWith(userId);
    expect(mockFindById).toHaveBeenCalledWith(mealPlanId);
    expect(mockDelete).toHaveBeenCalledWith(mealPlanId);
    expect(result).toEqual({ success: true });
  });

  // ERROR: Meal plan not found
  test("should throw an error if the meal plan does not exist", async () => {
    const userId = "nutritionist123";
    const mealPlanId = "missingPlan";

    mockVerifyAccess.mockResolvedValue({ id: userId, role: "nutritionist" });
    mockFindById.mockResolvedValue(null); // not found

    await expect(deleteMealPlanService(userId, mealPlanId)).rejects.toThrow(
      "Meal plan not found"
    );

    expect(mockFindById).toHaveBeenCalledWith(mealPlanId);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  // ERROR: Unauthorized user (access denied)
  test("should throw an error if user does not have permission", async () => {
    const userId = "client123";
    const mealPlanId = "plan001";

    mockVerifyAccess.mockRejectedValue(
      new Error("Access denied: only admins or nutritionists can manage meal plans")
    );

    await expect(deleteMealPlanService(userId, mealPlanId)).rejects.toThrow(
      "Access denied: only admins or nutritionists can manage meal plans"
    );

    expect(mockFindById).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
