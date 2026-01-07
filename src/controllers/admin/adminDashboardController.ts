import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { 
  getAdminDashboardService, 
  getUserByIdService, 
  assignNutritionistToClientService 
} from "../../services/adminService";
import { BadRequestError, UnauthorizedError } from "../../errors";

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dashboardData = await getAdminDashboardService();
    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("User not found error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const assignNutritionistToClient = async (req: AuthenticatedRequest, res: Response) => {
  const adminId = req.user?._id;
  const { nutritionistId, clientId } = req.body;

 
    if (!adminId) {
      throw new UnauthorizedError("Invalid user ID");
    }

    if (!nutritionistId || !clientId) {
      throw new BadRequestError("Nutritionist ID and clientUserId is required");
    }

  try {
    const updatedClient = await assignNutritionistToClientService(clientId, nutritionistId);
    res.status(200).json({
      success: true,
      message: "Nutritionist assigned successfully",
      data: updatedClient,
    });
  } catch (err: any) {
    console.error("[assignNutritionistToClient] Error:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
      user: req.user?._id,
    });
    res.status(500).json({ success: false, message: "Server error" });
  }
};
