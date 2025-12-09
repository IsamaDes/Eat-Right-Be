import React from 'react'
import { getAdminProfileService } from '../../services/adminService';
import type { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { NotFoundError, UnauthorizedError } from '../../errors';

export const adminProfile = async(req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
     if(!userId) throw new UnauthorizedError("Invalid user Id");

      const profileData = await getAdminProfileService(userId);
      if (!profileData) {
          throw new NotFoundError("Admin profile not found");
        }
      res.status(200).json({
        success: true,
        data: profileData,
      });
    } catch (error: any) {
      console.error("Admin profile error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
}


