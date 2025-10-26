import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validateRegistrationInput from "../../utils/validation.js";
import { UserRepository } from "../../repositories/userRepository.js";


const registerUser = async (name: string, email: string, password: string, role: string, res: Response ) => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new Error(errors.join(" "));
  }

  const cleanEmail = sanitized.email

  const existing = await UserRepository.findByEmail(cleanEmail);

  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const user = await UserRepository.create({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
  });


console.log("Registration successful for:", user.email, user._id);

  return {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};
  
};

export default registerUser;
