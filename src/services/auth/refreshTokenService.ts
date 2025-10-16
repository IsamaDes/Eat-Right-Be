
import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken } from "../../utils/tokenUtils.js";
import User from "../../models/User.js";

export const refreshAccessToken = async (req: Request, res: Response) => {
  console.log("refrshTokenAccessToken is being hit")
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new Error("No Refresh token provided");

try{
 const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

  const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("❌ User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

 const newAccessToken = generateAccessToken(user._id.toString())

 res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

  console.log("✅ New access token set");  
  res.json({ message: "Token refreshed" });

}catch (err) {
  console.error("Error refreshing token:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
  
};
