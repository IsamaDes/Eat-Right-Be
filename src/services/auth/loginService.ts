import type{ Response} from "express";
import bcrypt from "bcryptjs";
import jwt from  "jsonwebtoken";
import User from "../../models/User.js";
import sendAuthCookies from "../../utils/cookiesStore.js";


const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;


/**
 * Login a user with email and password.
 * Handles account locking and sets secure cookies for tokens.
 */

const loginUser = async (email: string, password: string, res: Response) => {
  

  if (!email || !password) throw new Error("Email and password required");
console.log("🔹 Login attempt email:", email.toLowerCase());

  const user = await User.findOne({ email: email.toLowerCase() });
  console.log("🔍 Found user:", user);
  if (!user) throw new Error("User not found");

  //Check if account is locked
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minutes`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Increment failed attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    // Lock if attempts exceed max
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      user.loginAttempts = 0; // reset count after locking
    }
      await user!.save();
    throw new Error("Invalid credentials");
  }
    
  // Reset failed attempts if successful
  user.loginAttempts = 0;
  user.lockUntil = null as any;


  await user!.save();

  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" } 
  );

  console.log("🔑 Access Token:", accessToken);
console.log("🔑 Refresh Token:", refreshToken);
console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("🔑 JWT_REFRESH_SECRET exists:", !!process.env.JWT_REFRESH_SECRET);

// Store tokens in secure cookies
  sendAuthCookies(res, accessToken, refreshToken);

  console.log("✅ Login successful for:", user.email);


  return {
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  
};

export default  loginUser;

