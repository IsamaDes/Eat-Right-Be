import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { 
  getAdminDashboardService, 
  getUserByIdService, 
  assignNutritionistToClientService 
} from "../../services/adminService";

// Returns basic stats for the admin dashboard
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

// Get user by ID
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


// Assign a nutritionist to a client
export const assignNutritionistToClient = async (req: AuthenticatedRequest, res: Response) => {
  const { clientId, nutritionistId } = req.body;

  if (!clientId || !nutritionistId) {
    return res.status(400).json({ success: false, message: "Both clientId and nutritionistId are required." });
  }

  try {
    const result = await assignNutritionistToClientService(clientId, nutritionistId, req.user?._id);

    res.status(200).json({
      success: true,
      message: result.message,
      client: result.client,
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
