import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {getNutritionistProfile, getClients, createMealPlan, } from "../controllers/nutritionist/nutritionistController.js";


// Nutritionist-only routes
router.get(
  "/profile",
  protect,
  authorizeRoles("nutritionist"),
  getNutritionistProfile
);

router.get(
  "/clients",
  protect,
  authorizeRoles("nutritionist"),
  getClients
);


router.post(
  "/create",
  authorizeRoles("admin", "nutritionist"),
  createMealPlan
);



export default router;
