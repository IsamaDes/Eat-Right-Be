import React from 'react'
import { getAdminProfileService, getClientProfileService } from '../../services/adminService';
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


export const getClientProfile = async(req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?._id;
    if (!adminId) throw new UnauthorizedError("Unauthorized");

    const { clientId } = req.params;
    if (!clientId) throw new NotFoundError("Client ID required");

    const data = await getClientProfileService(clientId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};




