import {Router} from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { getAdminDashboard } from "../controllers/admin/adminController";

const router =  Router();

// Only admins can access dashboard
router.get(
  "/dashboard",
  protect,                  // User must be logged in
  authorizeRoles("admin"),  // User must be admin
  getAdminDashboard
);

// Example: general admin route that any logged-in user can see (rare for admin)
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is the admin profile page", user: req.user });
});

export default router;
