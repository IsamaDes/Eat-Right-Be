import bcrypt from "bcryptjs";
import { UserRepository } from "../../../src/repositories/userRepository";
import validateRegistrationInput from "../../../src/utils/validation";
import registerUser from "../../../src/services/auth/registerService";
import type { Response } from "express";

jest.mock("bcryptjs");
jest.mock("../../../src/repositories/userRepository");
jest.mock("../../../src/utils/validation");

describe("registerUser", () => {
  const mockRes = {} as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Invalid input
  test("should throw error if validation fails", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: false,
      errors: ["Invalid email", "Password too short"],
      sanitized: {},
    });

    await expect(
      registerUser("John", "invalid@", "12", "client", mockRes)
    ).rejects.toThrow("Invalid email Password too short");
  });

  // User already exists
  test("should throw error if user already exists", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
      sanitized: { name: "John", email: "john@example.com", password: "pass123" },
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ _id: "1", email: "john@example.com" });

    await expect(
      registerUser("John", "john@example.com", "pass123", "client", mockRes)
    ).rejects.toThrow("User already exists");
  });

  // Successful registration
  test("should create user and return basic info", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
      sanitized: { name: "Jane", email: "jane@example.com", password: "strongpass" },
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (UserRepository.create as jest.Mock).mockResolvedValue({
      _id: "123",
      name: "Jane",
      email: "jane@example.com",
      role: "client",
    });

    const result = await registerUser("Jane", "jane@example.com", "strongpass", "client", mockRes);

    expect(result).toEqual({
      success: true,
      message: "Registration successful",
      data: {
      id: "123",
      name: "Jane",
      email: "jane@example.com",
      role: "client",
      }
    });
  });

  // Password is hashed before saving...Confirms bcrypt.hash is called and not plain password
  test("should hash password before saving to repository", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
      sanitized: { name: "Mike", email: "mike@example.com", password: "plainPass" },
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
    (UserRepository.create as jest.Mock).mockResolvedValue({
      _id: "321",
      name: "Mike",
      email: "mike@example.com",
      role: "client",
    });

    await registerUser("Mike", "mike@example.com", "plainPass", "client", mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith("plainPass", 10);
    expect(UserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: "hashedPass" })
    );
  });
});
