import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import validateRegistrationInput from "../../utils/validation.js";


const registerUser = async (name: string, email: string, password: string, role: string, res: Response ) => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new Error(errors.join(" "));
  }

  const cleanEmail = sanitized.email.toLowerCase();

  const existing = await User.findOne({ email: cleanEmail });

  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);


  const user = new User({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
  });
  console.log("just before saving user", user)

  await user.save();

console.log("✅ Registration successful for:", user.email, user._id);

  return {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};
  
};

export default registerUser;
