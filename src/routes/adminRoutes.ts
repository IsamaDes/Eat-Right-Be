import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import {getAdminDashboard, getUserById, assignNutritionistToClient} from "../controllers/admin/adminDashboardController";


router.use(protect)
// Only admins can access dashboard
router.get(
  "/dashboard",                 // User must be logged in
  authorizeRoles("admin"),  // User must be admin
  getAdminDashboard
);


router.get("/users/:id", authorizeRoles("admin", "nutritionist"), getUserById);
router.patch("/assign-nutritionist", authorizeRoles("admin"), assignNutritionistToClient)


export default router;
