import { createMealPlanService } from "../../../src/services/nutrition/createMealPlan.service";
import { mealPlanRepository } from "../../../src/repositories/mealPlanRepository";
import { verifyNutritionistAccess } from "../../../src/services/nutrition/nutritionAccess.service";

// Mock dependencies
jest.mock("../../../src/repositories/mealPlanRepository");
jest.mock("../../../src/services/nutrition/nutritionAccess.service");

describe("createMealPlanService", () => {
  const mockVerifyAccess = verifyNutritionistAccess as jest.Mock;
  const mockCreate = mealPlanRepository.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SUCCESS: Creates a new meal plan when inputs are valid
  test("should create a meal plan successfully when all fields are valid", async () => {
    const userId = "nutritionist123";
    const mockUser = { id: userId, name: "Jane Doe" };
    mockVerifyAccess.mockResolvedValue(mockUser);

    const mockMealPlan = {
      id: "plan001",
      clientId: "client123",
      clientName: "John Client",
      nutritionistName: "Jane Doe",
      numberOfWeeks: 4,
      weeklyMealPlans: [{ week: 1, meals: [] }],
    };
    mockCreate.mockResolvedValue(mockMealPlan);

    const input = {
      clientId: "client123",
      clientName: "John Client",
      dateRange: "2025-01-01 to 2025-01-28",
      numberOfWeeks: 4,
      healthGoal: "Weight Loss",
      nutritionalRequirement: "Low Carb",
      weeklyMealPlans: [{ week: 1, meals: [] }],
    };

    const result = await createMealPlanService(userId, input);

    expect(mockVerifyAccess).toHaveBeenCalledWith(userId);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "client123",
        clientName: "John Client",
        nutritionistName: "Jane Doe",
      })
    );
    expect(result).toEqual(mockMealPlan);
  });

  // ERROR: Missing required fields (clientId or weeklyMealPlans)
  test("should throw an error if required fields are missing", async () => {
    const userId = "nutritionist123";
    mockVerifyAccess.mockResolvedValue({ id: userId, name: "Jane Doe" });

    const invalidInput = {
      clientName: "John Client",
      weeklyMealPlans: [], // empty
    };

    await expect(createMealPlanService(userId, invalidInput)).rejects.toThrow(
      "Missing required meal plan information"
    );

    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ERROR: User fails access verification
  test("should throw an error if user is not authorized", async () => {
    const userId = "unauthorizedUser";
    mockVerifyAccess.mockRejectedValue(new Error("Access denied"));

    const validInput = {
      clientId: "client123",
      clientName: "John Client",
      numberOfWeeks: 4,
      weeklyMealPlans: [{ week: 1, meals: [] }],
    };

    await expect(createMealPlanService(userId, validInput)).rejects.toThrow(
      "Access denied"
    );

    expect(mockCreate).not.toHaveBeenCalled();
  });
});
