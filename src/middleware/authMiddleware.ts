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

interface AuthenticatedRequest extends Request {
  user?: any;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Extract token from header
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader?.split(" ")[1]
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


/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Look for "Bearer <token>" in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // Fetch user from DB (without password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // Attach user to request
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export default auth;
