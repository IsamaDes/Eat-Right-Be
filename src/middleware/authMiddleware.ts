import type { Request, Response, NextFunction } from "express";

import Jwt, { JwtPayload }  from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";


export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
      console.log("No access token in cookies");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
      
     const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      // Fetch user from DB (without password)
      const user = await UserRepository.findById(decoded.id)
    
      req.user = {_id: user._id.toString(), email: user.email, role: user.role}; // Attach user to request
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  
};

export default protect;
