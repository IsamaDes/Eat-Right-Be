import { Request, Response, NextFunction } from "express";
import { getUserByIdService, getUserProfileService } from "../../services/userService";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
     try {
    const userId = req.params.id;
    const profile = await getUserProfileService(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}



export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserByIdService(req.user._id);

    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error in /me controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};