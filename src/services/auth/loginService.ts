import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return {
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export default loginUser;

