// Defines the shape and constraints for user input.
// Produces the type UserInput for compile-time safety.
// Prevents invalid or malicious data from reaching your DB.

import { z } from "zod";

//Authentication
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CLIENT", "NUTRITIONIST", "ADMIN"]). default("CLIENT"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


//client
export const UpdateClientProfileSchema = z.object({
  healthGoal: z.string().optional(), 
  age: z.number().int().optional(), 
});

//nutritionist
export const UpdateNutritionistProfileSchema = z.object({
 certification: z.string().optional(),
  experienceYears: z.number().optional(),
});

//admin
export const UpdateAdminProfileSchema = z.object({
  permissions: z.array(z.string()).optional(),
  roleDescription: z.string().optional(),
});



// export type UserInput = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateNutritionistProfileInput = z.infer<typeof UpdateNutritionistProfileSchema>;
export type UpdateAdminProfileInput = z.infer<typeof UpdateAdminProfileSchema>;
export type UpdateClientProfileInput = z.infer<typeof UpdateClientProfileSchema>;



