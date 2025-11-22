import type { Response } from "express";
import bcrypt from "bcryptjs";
import validateRegistrationInput from "../../utils/validation";
import { UserRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../errors";


const registerUser = async (name: string, email: string, password: string, role: string, res: Response ) => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new BadRequestError(errors.join(" "));
  }

  const cleanEmail = sanitized.email

  const existing = await UserRepository.findByEmail(cleanEmail);

  if (existing) throw new BadRequestError("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const user = await UserRepository.create({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
  });

console.log("Registration successful for:", user.email, user._id);

  return {
     success: true,
  message: "Registration successful",
  data: {
    id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  }
  
};
  
};

export default registerUser;
