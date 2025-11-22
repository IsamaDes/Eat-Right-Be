import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getNutritionistProfile, getClients, createMealPlan, getMealPlans, updateMealPlan, getMealPlanById} from "../controllers/nutritionist/nutritionistController";

router.use(protect);
// Nutritionist-only routes
router.get(
  "/profile",
  authorizeRoles("nutritionist"),
  getNutritionistProfile
);

router.get(
  "/clients",
  authorizeRoles("nutritionist"),
  getClients
);


router.post(
  "/create",
  authorizeRoles("admin", "nutritionist"),
  createMealPlan
);

router.get("/", authorizeRoles("admin", "nutritionist", "client"), getMealPlans);

router.put(
  "/:id",
  authorizeRoles("admin", "nutritionist"),
  updateMealPlan
);

router.get(
  "/:id",
  authorizeRoles("admin", "nutritionist", "client"),
  getMealPlanById
);

export default router;


