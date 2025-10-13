
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../models/User.js";

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No token provided");


  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  const user = await User.findById((decoded as JwtPayload).userId);

  if (!user) throw new Error("Invalid token");

  // Check: token matches the one stored in DB
  if (user.refreshToken !== refreshToken) {
    throw new Error("Token mismatch");
  }

  // ✅ Create new access token
  const newAccessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return newAccessToken;
};
