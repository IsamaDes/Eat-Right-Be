import type { Request, Response, NextFunction } from "express";

import User from "../models/User.js";
import Jwt, { JwtPayload }  from "jsonwebtoken";



/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req: Request, res: Response, next: NextFunction) => {

  
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
      console.log("❌ No access token in cookies");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    console.log("✅ Token found:", token.substring(0, 20) + "...");
      
     const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
     console.log("✅ Token decoded:", decoded);

      // Fetch user from DB (without password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("❌ User not found for ID:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ User authenticated:", user.email);
      
      req.user = {_id: user._id.toString(), email: user.email, role: user.role}; // Attach user to request
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  
};

export default protect;
