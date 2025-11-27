import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getNutritionistProfile, getClients, createMealPlan, getMealPlans, updateMealPlan, getMealPlanById} from "../controllers/nutritionist/nutritionistController";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

router.use(protect);
// Nutritionist-only routes
router.get(
  "/profile",
  authorizeRoles("nutritionist"),
  cacheMiddleware(req => `nutritionist:profile:${req.user?.id}`, 3600),
  getNutritionistProfile
);

router.get(
  "/clients",
  authorizeRoles("nutritionist"),
  cacheMiddleware(req => `nutritionist:clients:${req.user?.id}`, 1800),
  getClients
);


router.post(
  "/create",
  authorizeRoles("admin", "nutritionist"),
  createMealPlan
);

router.get("/", authorizeRoles("admin", "nutritionist", "client"),
cacheMiddleware(req => `mealplans:user:${req.user?.id}`, 600),
getMealPlans);

router.put(
  "/:id",
  authorizeRoles("admin", "nutritionist"),
  updateMealPlan
);

router.get(
  "/:id",
  authorizeRoles("admin", "nutritionist", "client"),
  cacheMiddleware(req => `mealplan:${req.params.id}`, 600),
  getMealPlanById
);

export default router;


