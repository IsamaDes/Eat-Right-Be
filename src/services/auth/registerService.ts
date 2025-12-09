import type { Response } from "express";
import { UserRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../errors";
import { RegisterSchema, RegisterInput } from "../../utils/validators/UserValidator";
import { ZodError } from "zod";
import { ClientRepository } from "../../repositories/clientRepository";
import { NutritionistRepository } from "../../repositories/nutritionistRepository";
import { AdminRepository } from "../../repositories/adminRepository";
import { prisma } from "../../lib/prisma";


export type UserRole = "CLIENT" | "NUTRITIONIST" | "ADMIN";

const registerUser = async (name: string, email: string, password: string, role: string, res: Response ) => {
  try{
 
  const parsedInput: RegisterInput = RegisterSchema.parse({
     name,
      email,
      password,
      role,
  })

   const existing = await UserRepository.findByEmail(parsedInput.email);

  if (existing) throw new BadRequestError("User already exists");


   const user = await prisma.$transaction(async (tx) => {
  const createdUser = await tx.user.create({
        data: {
          name: parsedInput.name,
          email: parsedInput.email,
          password: parsedInput.password, 
          role: parsedInput.role,
        },
      });

    switch (parsedInput.role) {
    case "CLIENT":
      await ClientRepository.createClientProfile(user.id);
      break;

    case "NUTRITIONIST":
      await NutritionistRepository.createNutritionistUser(user.id);
      break;

    case "ADMIN":
      await AdminRepository.createAdminProfile(user.id);
      break;
  }

   return createdUser;
});

console.log("Registration successful for:", user.email, user.id);

  return {
  success: true,
  message: "Registration successful",
  data: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
};


  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw new BadRequestError(
        `Validation error: ${JSON.stringify(error.issues)}`,
        error.issues 
      );
    }
    if (error instanceof Error) {
      throw error; 
    }
    
    throw new BadRequestError("Unknown error occurred during registration");
  }
};

export default registerUser;
