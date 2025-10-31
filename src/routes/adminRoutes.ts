import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {getAdminDashboard, getUserById, assignNutritionistToClient} from "../controllers/admin/adminDashboard.controller.js";


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
