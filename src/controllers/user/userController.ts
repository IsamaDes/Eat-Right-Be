import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { getUserService, updateUserProfile } from "../../services/userService";
import { ZodError } from "zod";


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

export const updateProfileController = async (req: AuthenticatedRequest, res: Response) => {
try{
   if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const role = req.user.role;
    const updates = req.body;

    const updatedProfile = await updateUserProfile(userId, role, updates);

    return res.json({ success: true, data: updatedProfile });
   }catch(err: any){
   if (err instanceof ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: err.issues 
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
