import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import generateTokenAndHash from "../../utils/tokenUtils.js";
import {validateRegistrationInput,  sanitizeInput, isValidEmail, isStrongPassword,} from "../../utils/validation.js";

interface RegisteredUserResponse {
  id: string;
  email: string;
  role: string;
  token: string;
}

const registerUser = async (name: string, email: string, password: string, role: string): Promise<RegisteredUserResponse> =>{

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new Error(errors.join(" "));
  }

  const cleanEmail = sanitized.email.toLowerCase();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const { token, tokenHash } = generateTokenAndHash();

  const user = new User({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
    tokenHash,
    tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await user.save();

  return {
  
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  token,

};
  
};

export default registerUser;
