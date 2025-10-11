import type { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

module.exports = {protect};
