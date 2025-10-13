import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {getNutritionistProfile, getClients} from "../controllers/nutritionist/nutritionistController.js";

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

export default router;
