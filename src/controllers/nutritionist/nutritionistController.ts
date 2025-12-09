import type { Response, NextFunction } from "express";
import { createMealPlanService,getMealPlansService, updateMealPlanService, getMealPlanByIdService, getNutritionistClients } from "../../services/nutrition/NutrionistService"
import { UserRepository } from "../../repositories/userRepository";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { commentOnMealPlanService } from "../../services/nutrition/NutrionistService";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors";
import getNutritionistDashboardService from "../../services/nutrition/NutritionistDashboardService";
import UpdateNutritionistProfileInpu


    export const getNutritionistDashboard = async(req: AuthenticatedRequest, res: Response) => {
    try{

      const nutritionistId = req.user!._id
      const dashboard = await getNutritionistDashboardService(nutritionistId);
       return res.status(200).json({
      success: true,
      data: dashboard,
    });
    }catch(error: any){
      console.error("Nutritionist Dashboard Error:", error);
      return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
    }
};

 //Returns the profile of the logged-in nutritionist
export const getNutritionistProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!._id; 
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
    const nutritionistId = req.user!._id;    
    const clients = await getNutritionistClients(nutritionistId);
    res.status(200).json({ success: true, data: clients });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createMealPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;
    const mealPlan = await createMealPlanService(userId, req.body);
    res.status(201).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};


export const getMealPlans = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;
    const result = await getMealPlansService(userId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};


export const updateMealPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const updatedPlan = await updateMealPlanService(userId, id, req.body);
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (err: any) {
    next(err);
  }
};


export const getMealPlanById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const mealPlan = await getMealPlanByIdService(userId, id);
    res.status(200).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};


export const commentOnProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try{
     const { text } = req.body;
     const mealPlanId = req.params.id
     const userId = req.params.userId;
    
      if (!text || !mealPlanId || !userId) {
      throw new BadRequestError("Text, mealPlanId and authorId are required");
    }

  const updatedMealPlan = await commentOnMealPlanService({text, mealPlanId, userId});

    if (!updatedMealPlan) {
      throw new NotFoundError("Meal plan not found");
    }

  return res.status(200).json({
     success: true,
      message: "Comment added successfully",
      data: updatedMealPlan,
  });
  }  
  catch(err){
    next(err)
  }
}


// controllers/nutritionist.controller.ts
export const UpdateNutritionistProfile = async(req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedError("Invalid user Id");

    const { certification, experienceYears } = req.body;

    // Validation
    if (experienceYears !== undefined && (typeof experienceYears !== 'number' || experienceYears < 0)) {
      return res.status(400).json({ 
        message: "Experience years must be a positive number" 
      });
    }

    if (certification !== undefined && typeof certification !== 'string') {
      return res.status(400).json({ 
        message: "Certification must be a string" 
      });
    }

    const updates: Partial<UpdateNutritionistProfileInput> = {
      ...(certification !== undefined && { certification }),
      ...(experienceYears !== undefined && { experienceYears })
    };

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        message: "No valid fields to update" 
      });
    }

    const updatedProfile = await updateNutritionistProfileService(userId, updates);

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error: any) {
    console.error("Update nutritionist profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};