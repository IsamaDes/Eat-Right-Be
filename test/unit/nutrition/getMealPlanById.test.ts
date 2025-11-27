import { getMealPlanByIdService } from "../../../src/services/nutrition/getMealPlanById.service";
import { mealPlanRepository } from "../../../src/repositories/mealPlanRepository";
import { UserRepository } from "../../../src/repositories/userRepository";

jest.mock("../../../src/repositories/mealPlanRepository");
jest.mock("../../../src/repositories/userRepository");

describe("getMealPlanByIdService", () => {
  const mockFindUserById = UserRepository.findById as jest.Mock;
  const mockFindMealPlanById = mealPlanRepository.findById as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SUCCESS: Admin user fetches any meal plan
  test("should return the meal plan if user is admin", async () => {
    const userId = "admin001";
    const mealPlanId = "plan001";

    mockFindUserById.mockResolvedValue({ _id: userId, role: "admin", name: "Admin" });
    mockFindMealPlanById.mockResolvedValue({
      id: mealPlanId,
      clientId: "client001",
      nutritionistName: "John Nutri",
    });

    const result = await getMealPlanByIdService(userId, mealPlanId);

    expect(mockFindUserById).toHaveBeenCalledWith(userId);
    expect(mockFindMealPlanById).toHaveBeenCalledWith(mealPlanId);
    expect(result).toHaveProperty("id", mealPlanId);
  });

  // ERROR: Meal plan not found
  test("should throw an error if the meal plan does not exist", async () => {
    const userId = "nutritionist001";
    const mealPlanId = "nonexistentPlan";

    mockFindUserById.mockResolvedValue({ _id: userId, role: "nutritionist", name: "John Nutri" });
    mockFindMealPlanById.mockResolvedValue(null); // not found

    await expect(getMealPlanByIdService(userId, mealPlanId)).rejects.toThrow(
      "Meal plan not found"
    );

    expect(mockFindMealPlanById).toHaveBeenCalledWith(mealPlanId);
  });

  // ERROR: Client tries to access another client’s plan
  test("should throw an error if a client tries to access another client's meal plan", async () => {
    const userId = "client001";
    const mealPlanId = "plan002";

    mockFindUserById.mockResolvedValue({ _id: userId, role: "client" });
    mockFindMealPlanById.mockResolvedValue({ clientId: "otherClient" });

    await expect(getMealPlanByIdService(userId, mealPlanId)).rejects.toThrow(
      "Access denied: you can only view your own meal plans"
    );
  });

  // ERROR: Nutritionist tries to access a plan they didn’t create
  test("should throw an error if a nutritionist tries to access a meal plan they did not create", async () => {
    const userId = "nutri001";
    const mealPlanId = "plan003";

    mockFindUserById.mockResolvedValue({ _id: userId, role: "nutritionist", name: "John Nutri" });
    mockFindMealPlanById.mockResolvedValue({
      clientId: "client001",
      nutritionistName: "Other Nutri",
    });

    await expect(getMealPlanByIdService(userId, mealPlanId)).rejects.toThrow(
      "Access denied: you can only view meal plans you created"
    );
  });
});
