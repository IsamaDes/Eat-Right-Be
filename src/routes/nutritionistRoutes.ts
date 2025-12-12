import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getNutritionistProfile, getClients, createMealPlan, getMealPlans, updateMealPlan, getMealPlanById, getNutritionistDashboard} from "../controllers/nutritionist/nutritionistController";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

router.use(protect);
// Nutritionist-only routes
router.get(
  "/profile",
  authorizeRoles("NUTRITIONIST"),
  cacheMiddleware(req => `nutritionist:profile:${req.user?.id}`, 3600),
  getNutritionistProfile
);

router.get(
  "/clients",
  authorizeRoles("NUTRITIONIST"),
  cacheMiddleware(req => `nutritionist:clients:${req.user?.id}`, 1800),
  getClients
);


router.post(
  "/create-mealplan",
  authorizeRoles("ADMIN", "NUTRITIONIST"),
  createMealPlan
);

router.get("/", authorizeRoles("ADMIN", "NUTRITIONIST", "CLIENT"),

cacheMiddleware(
  req => `mealplans:user:${req.user?.id}`, 600),
getMealPlans);

router.put(
  "/:id",
  authorizeRoles("ADMIN", "NUTRITIONIST"),
  updateMealPlan
);

router.get(
  "/dashboard",
  authorizeRoles("NUTRITIONIST"),
  cacheMiddleware(req => `nutritionist:dashboard:${req.user?.id}`, 600),
  getNutritionistDashboard
);

router.get(
  "/:id",
  authorizeRoles("ADMIN", "NUTRITIONIST", "CLIENT"),
  cacheMiddleware(req => `mealplan:${req.params.id}`, 600),
  getMealPlanById
);


export default router;


