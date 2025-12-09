import { getMealPlansService } from "../../../src/services/nutrition/getMealPlans.service";
import { mealPlanRepository } from "../../../src/repositories/mealPlanRepository";
import { UserRepository } from "../../../src/repositories/userRepository";

jest.mock("../../../src/repositories/mealPlanRepository");
jest.mock("../../../src/repositories/userRepository");

describe("getMealPlansService", () => {
  const mockFindUserById = UserRepository.findById as jest.Mock;
  const mockGetFiltered = mealPlanRepository.getFiltered as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Admin: sees all meal plans (no role filter applied)
  test("should return all meal plans for admin", async () => {
    const userId = "admin001";
    const filters = { page: 1, limit: 10 };

    mockFindUserById.mockResolvedValue({ _id: userId, role: "admin", name: "Admin" });
    mockGetFiltered.mockResolvedValue({
      mealPlans: [{ id: "plan1" }, { id: "plan2" }],
      total: 2,
      totalPages: 1,
    });

    const result = await getMealPlansService(userId, filters);

    expect(mockFindUserById).toHaveBeenCalledWith(userId);
    expect(mockGetFiltered).toHaveBeenCalledWith({}, 1, 10);
    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });

  // Nutritionist: should only see their own meal plans
  test("should filter by doctorName for nutritionist role", async () => {
    const userId = "nutri001";
    const filters = { limit: 5 };

    mockFindUserById.mockResolvedValue({ _id: userId, role: "nutritionist", name: "Dr. Nutri" });
    mockGetFiltered.mockResolvedValue({
      mealPlans: [{ id: "plan1" }],
      total: 1,
      totalPages: 1,
    });

    const result = await getMealPlansService(userId, filters);

    expect(mockGetFiltered).toHaveBeenCalledWith({ doctorName: "Dr. Nutri" }, 1, 5);
    expect(result.data).toHaveLength(1);
  });

  // Client: should only see their own meal plans
  test("should filter by patientId for client role", async () => {
    const userId = "client001";
    const filters = {};

    mockFindUserById.mockResolvedValue({ _id: userId, role: "client", name: "Jane" });
    mockGetFiltered.mockResolvedValue({
      mealPlans: [{ id: "planC" }],
      total: 1,
      totalPages: 1,
    });

    const result = await getMealPlansService(userId, filters);

    expect(mockGetFiltered).toHaveBeenCalledWith({ patientId: userId }, 1, 10);
    expect(result.pagination.totalPages).toBe(1);
  });

  // Filter: should apply regex search by patientName
  test("should apply regex filter when patientName is provided", async () => {
    const userId = "admin001";
    const filters = { patientName: "John", page: 2, limit: 5 };

    mockFindUserById.mockResolvedValue({ _id: userId, role: "admin" });
    mockGetFiltered.mockResolvedValue({
      mealPlans: [{ id: "planX" }],
      total: 1,
      totalPages: 1,
    });

    const result = await getMealPlansService(userId, filters);

    expect(mockGetFiltered).toHaveBeenCalledWith(
      { patientName: { $regex: "John", $options: "i" } },
      2,
      5
    );
    expect(result.data[0].id).toBe("planX");
  });
});
