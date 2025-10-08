import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";

// Extend Express Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || "";
    
    // Extract token from header
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    const payload = jwt.verify(token, secret) as JwtPayload & { id: string };

    // Fetch user (exclude sensitive fields)
    const user = await User.findById(payload.id).select(
      "-password -tokenHash -tokenExpiry"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // Attach user info to request object
    req.user = user;
    next();
  } catch (err: any) {
    console.error("Auth Error:", err.message);
    return res
      .status(401)
      .json({ message: "Authentication failed", error: err.message });
  }
};

export default auth;
