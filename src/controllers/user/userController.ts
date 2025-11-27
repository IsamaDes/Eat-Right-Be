import { Request, Response, NextFunction } from "express";
import { getUserProfileService } from "../../services/userService";

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