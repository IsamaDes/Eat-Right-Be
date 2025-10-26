import type { Request, Response, NextFunction } from "express";
import { createMealPlanService,getMealPlansService, updateMealPlanService, getMealPlanByIdService } from "../../services/nutrition"
import { UserRepository } from "../../repositories/userRepository.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";


 //Returns the profile of the logged-in nutritionist
export const getNutritionistProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id; 
    if(!userId) throw new Error("invalid user id")
    const nutritionist = await UserRepository.findById(userId);
  
    res.status(200).json({
      success: true,
      data: nutritionist,
    });
  } catch (error: any) {
    console.error("Error fetching nutritionist profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 // Returns all clients assigned to the logged-in nutritionist
export const getClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const nutritionistId = req.user?._id;
    if(!nutritionistId) throw new Error("Invalid nutritionist Id")
    
    // Find all clients assigned to this nutritionist
    const clients = await UserRepository.findClientsByNutritionist(nutritionistId);
    res.status(200).json({ success: true, data: clients });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no valid token" });
    }
    const mealPlan = await createMealPlanService(userId, req.body);
    res.status(201).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};


export const getMealPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const result = await getMealPlansService(userId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};


export const updateMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const updatedPlan = await updateMealPlanService(userId, id, req.body);
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (err: any) {
    next(err);
  }
};

export const getMealPlanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const mealPlan = await getMealPlanByIdService(userId, id);
    res.status(200).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};