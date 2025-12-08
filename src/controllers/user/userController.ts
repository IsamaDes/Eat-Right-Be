import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { getUserService } from "../../services/userService";

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await getUserService.getCurrentUserService(req.user._id);

       if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error in /me controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};