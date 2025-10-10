const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;

const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  //Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minutes`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Increment failed attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    // Lock if attempts exceed max
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
      user.loginAttempts = 0; // reset count after locking
    }

    throw new Error("Invalid credentials");
  }
    

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "5d" } 
  );

  return {
    success: "Login successful",
    data: { id: user._id, name: user.name, email: user.email, role: user.role,  token, refreshToken },
  };
};

module.exports =  loginUser;

