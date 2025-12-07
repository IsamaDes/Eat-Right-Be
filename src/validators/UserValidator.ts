// Defines the shape and constraints for user input.

// Produces the type UserInput for compile-time safety.

// Prevents invalid or malicious data from reaching your DB.

import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
  subscription: z.string().optional(),
  age: z.number().int().optional(),
  healthGoal: z.string().optional(),
  role: z.enum(["ADMIN", "CLIENT"]).default("CLIENT"),

  // Fields for login lockout
  loginAttempts: z.number().int().default(0),
  lockUntil: z
  .string()
  .optional()
  .nullable()
});

export type UserInput = z.infer<typeof UserSchema>;