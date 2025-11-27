
import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../../src/app";
import { UserRepository } from "../../src/repositories/userRepository";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("Auth Integration Tests", () => {
  // Setup: Connect to test database

  beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});


  beforeAll(async () => {
    // Increase timeout for database connection
    jest.setTimeout(30000);
    
    const mongoUri = process.env.MONGO_URI;
     if (!mongoUri) {
      throw new Error(
        "MongoDB URI not found. Please set MONGO_URI_TEST or MONGO_URI in your environment variables."
      );}

         if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log("✓ Test database connected");
    }
  }, 30000);
  

  // Clean up database before each test
  beforeEach(async () => {
    await UserRepository.deleteAll();
  }, 10000);

  // Cleanup: Close database connection
  afterAll(async () => {
    await UserRepository.deleteAll();
    await mongoose.connection.close();
  }, 10000);

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123!",
        role: "client",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email.toLowerCase());
      expect(response.body.data.role).toBe(userData.role);
      expect(response.body.data).not.toHaveProperty("password");

      // Verify user exists in database
      const savedUser = await UserRepository.findByEmail(userData.email);
      expect(savedUser).toBeDefined();
      expect(savedUser?.email).toBe(userData.email.toLowerCase());
    });

    it("should NOT register a user if email already exists", async () => {
      const userData = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "SecurePass123!",
        role: "client",
      };

      // Register user first time
      await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should reject registration with invalid email", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "SecurePass123!",
        role: "client",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject registration with weak password", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "weak",
        role: "client",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /auth/login", () => {
    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: "SecurePass123!",
      role: "client",
    };

    beforeEach(async () => {
      // Create user manually with hashed password
      await request(app)
        .post("/auth/register")
        .send(testUser);
    }, 10000);
  

    it("should login a user", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "SecurePass123!",
        });

       expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe(testUser.email.toLowerCase());
      expect(response.body.data).not.toHaveProperty("password");

      // If JWT is set in cookies instead of response body:
      const cookies = response.headers['set-cookie'];
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^accessToken=/),
          expect.stringMatching(/^refreshToken=/),
        ])
      );
    });

    it("should reject invalid login credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "SomePassword123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should reject login without email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          password: testUser.password,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Email and password required");
    });

    it("should reject login without password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Email and password required");
    });

    it("should lock account after max failed login attempts", async () => {
      // Attempt login 3 times with wrong password
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post("/auth/login")
          .send({
            email: testUser.email,
            password: "WrongPassword",
          })
          .expect(401);
      }

      // Fourth attempt should show account locked
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.message).toContain("Account locked");
      expect(response.body.message).toContain("minutes");
    });

    it("should reset login attempts after successful login", async () => {
      // Fail once
      await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword",
        })
        .expect(401);

      // Then succeed
      await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      // Check that loginAttempts is reset
      const user = await UserRepository.findByEmail(testUser.email);
      expect(user?.loginAttempts).toBe(0);
      expect(user?.lockUntil).toBeNull();
    });

    it("should increment login attempts on each failed login", async () => {
      // Fail twice
      await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword",
        });

      await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword",
        });

      const user = await UserRepository.findByEmail(testUser.email);
      expect(user?.loginAttempts).toBe(2);
    });
  });
});