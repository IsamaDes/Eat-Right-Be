import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware";
import { getClientMealPlans, getClientMealSchedule, getClientProfile } from "../controllers/client/clientController";

router.get(
  "/profile",
  protect,                
  getClientProfile
);

router.get(
  "/meal-plans/:id",
  protect,
  getClientMealPlans
  
)


router.get(
  "/meal-schedule",
  protect,
  getClientMealSchedule 
)

export default router;
