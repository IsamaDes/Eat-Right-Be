import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getAdminDashboard, getUserById, assignNutritionistToClient} from "../controllers/admin/adminDashboardController";


router.use(protect)
// Only admins can access dashboard
router.get(
  "/dashboard",                 // User must be logged in
  authorizeRoles("ADMIN"),  // User must be admin
  getAdminDashboard
);


router.get("/users/:id", authorizeRoles("ADMIN", "NUTRITIONIST"), getUserById);
router.patch("/assign-nutritionist", authorizeRoles("ADMIN"), assignNutritionistToClient)


export default router;
