import {Router} from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { getNutritionistProfile, getClients } from "../controllers/nutritionist/nutritionistController";

const router = Router();

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
