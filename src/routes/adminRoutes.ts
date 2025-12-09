import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getAdminDashboard, getUserById, assignNutritionistToClient} from "../controllers/admin/adminDashboardController";
import { adminProfile } from "../controllers/admin/adminController";


router.use(protect)
router.get(
  "/dashboard",                
  authorizeRoles("ADMIN"),  
  getAdminDashboard
);

router.get("/profile", 
  authorizeRoles("ADMIN", "NUTRITIONIST", "CLIENT"),
  adminProfile
);

router.get("/users/:id", authorizeRoles("ADMIN", "NUTRITIONIST"), getUserById);
router.patch("/assign-nutritionist", authorizeRoles("ADMIN"), assignNutritionistToClient)


export default router;
