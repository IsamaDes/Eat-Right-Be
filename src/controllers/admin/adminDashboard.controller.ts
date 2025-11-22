import type { Request, Response } from "express";
import {AuthenticatedRequest} from "../../middleware/authMiddleware";
import { createUserService, getAdminDashboardService, getUserByIdService } from "../../services/adminService";
import { UserRepository } from "../../repositories/userRepository";

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

 export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = req.params;
    const user = await getUserByIdService(id);
      res.status(200).json({
      success: true,
      User: user,
    });
  
  } catch (error: any) {
    console.error("User not found error:", error);
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

export const assignNutritionistToClient = async(req: AuthenticatedRequest, res: Response) => {
 
  const {clientId, nutritionistId} = req.body;
   if (!clientId || !nutritionistId) {
      return res.status(400)
      .json({ success: false, message: "Both clientId and nutritionistId are required." });
    }

  try{
  const [client, nutritionist] = await Promise.all([
    UserRepository.findById(clientId), 
    UserRepository.findById(nutritionistId)
  ]);

   if (!nutritionist || nutritionist.role !== "nutritionist") {
      return res.status(400).
      json({ success: false, message: "Invalid nutritionist" });
    }


  client.assignedNutritionist = nutritionist._id;
  await UserRepository.save(client);

   res.status(200).json({
      success: true,
      message: `Nutritionist ${nutritionist.name} assigned to ${client.name}`,
      client,
    });
  }catch(err: any){
   console.error("[assignNutritionistToClient] Error:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
      user: req.user?._id,
    });
    res.status(500).json({ success: false, message: "Server error" });
  }
  
}