import type { Request, Response, NextFunction } from "express";
import Nutritionist from  "../../models/User.js"; 
import Client from "../../models/User.js";
import { createMealPlanService, getMealPlansService } from "../../services/nutritionService.js";

// Extend Request type to include user injected by `protect`
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * GET /api/nutritionist/profile
 * Returns the profile of the logged-in nutritionist
 */
export const getNutritionistProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id; // user is attached by `protect` middleware

    const nutritionist = await Nutritionist.findById(userId).select("-password -tokenHash");

    if (!nutritionist) {
      return res.status(404).json({ message: "Nutritionist not found" });
    }

    res.status(200).json({
      success: true,
      data: nutritionist,
    });
  } catch (error: any) {
    console.error("Error fetching nutritionist profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * GET /api/nutritionist/clients
 * Returns all clients assigned to the logged-in nutritionist
 */
export const getClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const nutritionistId = req.user._id;

    // Example: assuming Client model has a field `nutritionist: ObjectId`
    const clients = await Client.find({ nutritionist: nutritionistId }).select(
      "-password -tokenHash -tokenExpiry"
    );

    res.status(200).json({ success: true, data: clients });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
};






export const createMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id; // set by protect middleware (from cookie)
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



