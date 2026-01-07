import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { NotFoundError, UnauthorizedError } from "../../errors";
import { ClientRepository } from "../../repositories/clientRepository";
import { clientService } from "../../services/clientService";


// Returns the logged-in client's profile
 export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if(!userId) throw new UnauthorizedError("Invalid user Id")
    const client = await ClientRepository.getClientProfile(userId)
   if (!client) {
    throw new NotFoundError("Client profile not found");
  }
    res.status(200).json({
      success: true,
      data: {
      id: client.user.id,
      name: client.user.name,
      email: client.user.email,
      role: client.user.role,
      
      // Client-specific data (from Client table)
      clientId: client.id,
      healthGoal: client.healthGoal,
      age: client.age,
      subscription: client.subscription,
      assignedNutritionistId: client.assignedNutritionistId,
      assignedNutritionist: client.assignedNutritionist
      },
    });
  } catch (error: any) {
    console.error("Error fetching client profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getClientMealPlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.user?._id 
    if (!clientId) return res.status(400).json({ success: false, message: 'clientId is required' });

    const data = await clientService.getClientMealPlans(clientId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClientMealSchedule = async (req: AuthenticatedRequest, res: Response) => {

}