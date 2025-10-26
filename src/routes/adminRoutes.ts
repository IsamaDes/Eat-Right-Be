import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import getAdminDashboard from "../controllers/admin/adminController.js";



// Only admins can access dashboard
router.get(
  "/dashboard",
  protect,                  // User must be logged in
  authorizeRoles("admin"),  // User must be admin
  getAdminDashboard
);


export default router;
