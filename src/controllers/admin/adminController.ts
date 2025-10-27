import type { Request, Response } from "express";
import {AuthenticatedRequest} from "../../middleware/authMiddleware";
import { createUserService, getAdminDashboardService } from "../../services/adminService";

// * Returns basic stats for the admin dashboard
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

export const createUser = async(req: Request, res: Response ) => {
try{
    const {name, email, password, role} = req.body;
    const user = await createUserService(name, email, password, role);
    res.status(201).json({
     message: "User created successfully",
     user: {
      id: user.id,
      email: user.email,
     }
})
}catch(error: any){
 console.error("Registration error:", error.message);
    res.status(400).json({ message: error.message });
}
};