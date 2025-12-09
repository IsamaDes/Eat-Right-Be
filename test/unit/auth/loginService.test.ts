import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendAuthCookies from "../../../src/utils/cookiesStore";
import { UserRepository } from "../../../src/repositories/userRepository";
import loginUser from "../../../src/services/auth/loginService";
import type { Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../src/errors";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../src/utils/cookiesStore");
jest.mock("../../../src/repositories/userRepository");

describe("loginUser", () => {
  const mockRes = {
    cookie: jest.fn(),
  } as unknown as Response;

  const mockUser = {
    _id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedpass",
    role: "client",
    loginAttempts: 0,
    lockUntil: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_REFRESH_SECRET = "refreshsecret";
  });

  // Missing email or password
  test("should throw error if email or password is missing", async () => {
    await expect(loginUser("", "pass123", mockRes))
  .rejects.toBeInstanceOf(BadRequestError);

await expect(loginUser("john@example.com", "", mockRes))
  .rejects.toBeInstanceOf(BadRequestError);

  await expect(loginUser("", "pass123", mockRes))
  .rejects.toThrow("Email and password required");
  });

  // User not found
  test("should throw error if user not found", async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(loginUser("noone@example.com", "pass123", mockRes))
  .rejects.toBeInstanceOf(UnauthorizedError);
  });

  // Wrong password increments attempts and may lock account
  test("should throw error for invalid credentials and increment attempts", async () => {
    const fakeUser = { ...mockUser, loginAttempts: 1, save: jest.fn() };
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    (UserRepository.save as jest.Mock).mockResolvedValue(fakeUser);

    await expect(loginUser(fakeUser.email, "wrongpass", mockRes))
  .rejects.toBeInstanceOf(UnauthorizedError);

    expect(UserRepository.save).toHaveBeenCalled();
    expect(fakeUser.loginAttempts).toBeGreaterThanOrEqual(1);
  });

  // Successful login
  test("should return user and set cookies for valid login", async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");
    (UserRepository.save as jest.Mock).mockResolvedValue(mockUser);

    const result = await loginUser(mockUser.email, "correctpass", mockRes);

    expect(UserRepository.save).toHaveBeenCalledTimes(1);
    expect(sendAuthCookies).toHaveBeenCalledWith(mockRes, "fakeToken", "fakeToken");
    expect(result.success).toBe(true);
    expect(result.data.email).toBe(mockUser.email);
  });
});
