import {createUserService} from "../../../src/services/adminService";
import { UserRepository } from "../../../src/repositories/userRepository";
import { getAdminDashboardService } from "../../../src/services/adminService";

jest.mock("../../../src/repositories/userRepository");

describe("getAdminDashboardService", () => {
  const mockCountByRole = UserRepository.countByRole as jest.Mock;
  const mockFindLatestByRole = UserRepository.findLatestByRole as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Returns all counts and latest clients correctly
  test("should return total counts and latest clients", async () => {
    mockCountByRole
      .mockResolvedValueOnce(10) // clients
      .mockResolvedValueOnce(3)  // nutritionists
      .mockResolvedValueOnce(2); // admins

    const mockClients = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
    ];
    mockFindLatestByRole.mockResolvedValueOnce(mockClients);

    const result = await getAdminDashboardService();

    expect(mockCountByRole).toHaveBeenCalledTimes(3);
    expect(mockCountByRole).toHaveBeenNthCalledWith(1, "client");
    expect(mockCountByRole).toHaveBeenNthCalledWith(2, "nutritionist");
    expect(mockCountByRole).toHaveBeenNthCalledWith(3, "admin");

    expect(mockFindLatestByRole).toHaveBeenCalledWith("client", 5);

    expect(result).toEqual({
      total: {
        clients: 10,
        nutritionists: 3,
        admins: 2,
      },
      latestClients: mockClients,
    });
  });

  // Handles zero counts gracefully
  test("should handle case where all roles return zero", async () => {
    mockCountByRole.mockResolvedValue(0);
    mockFindLatestByRole.mockResolvedValue([]);

    const result = await getAdminDashboardService();

    expect(result.total).toEqual({
      clients: 0,
      nutritionists: 0,
      admins: 0,
    });
    expect(result.latestClients).toEqual([]);
  });

  // Calls countByRole and findLatestByRole in correct order
  test("should call repository methods in correct order", async () => {
    const callOrder: string[] = [];

    mockCountByRole.mockImplementation(async (role: string) => {
      callOrder.push(`count:${role}`);
      return 1;
    });

    mockFindLatestByRole.mockImplementation(async () => {
      callOrder.push("findLatestByRole");
      return [];
    });

    await getAdminDashboardService();

    expect(callOrder).toEqual([
      "count:client",
      "count:nutritionist",
      "count:admin",
      "findLatestByRole",
    ]);
  });

  // Throws when countByRole fails
  test("should throw if countByRole throws an error", async () => {
    mockCountByRole.mockRejectedValueOnce(new Error("DB error"));
    mockFindLatestByRole.mockResolvedValue([]);

    await expect(getAdminDashboardService()).rejects.toThrow("DB error");
  });

  // Throws when findLatestByRole fails
  test("should throw if findLatestByRole throws an error", async () => {
    mockCountByRole.mockResolvedValue(5);
    mockFindLatestByRole.mockRejectedValueOnce(new Error("Query failed"));

    await expect(getAdminDashboardService()).rejects.toThrow("Query failed");
  });
});


describe('createUserService', () => {

  const mockFindByEmail = UserRepository.findByEmail as jest.Mock;
  const mockCreate = UserRepository.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });
    
    test('should create a new user: ', async() => {
    
     mockFindByEmail.mockResolvedValueOnce(null);
     mockCreate.mockResolvedValueOnce({ id: "1", email: "john@example.com" });

    const result = await createUserService("John Doe", "john@example.com", "pass123", "user");

     expect(mockFindByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockCreate).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "pass123",
      role: "user",
    });
    expect(result).toEqual({ id: "1", email: "john@example.com" });
    })

    //Error on missing required fields
     test("should throw an error if required fields are missing", async () => {
    await expect(
      createUserService("", "test@example.com", "pass", "user")
    ).rejects.toThrow("Missing required fields");

    await expect(
      createUserService("John", "", "pass", "user")
    ).rejects.toThrow("Missing required fields");

    await expect(
      createUserService("John", "test@example.com", "pass", "")
    ).rejects.toThrow("Missing required fields");
  });

   //Error on user already exist
   test("should throw an error if user already exists", async () => {
    mockFindByEmail.mockResolvedValueOnce({ id: "123", email: "john@example.com" });

    await expect(
      createUserService("John", "john@example.com", "pass", "user")
    ).rejects.toThrow("User Already Exist");

    expect(mockFindByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockCreate).not.toHaveBeenCalled();
  });
})