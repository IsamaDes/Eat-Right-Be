import type { Request, Response, NextFunction } from "express";


import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
// const  authorizeRoles  = require("../middleware/roleMiddleware");
// const getAdminDashboard  = require("../controllers/admin/adminController");


// Only admins can access dashboard
// router.get(
//   "/dashboard",
//   protect,                  // User must be logged in
//   authorizeRoles("admin"),  // User must be admin
//   getAdminDashboard
// );

// Example: general admin route that any logged-in user can see (rare for admin)
router.get("/profile", protect, (req: Request, res: Response) => {
  res.json({ message: "This is the admin profile page", user: req.user });
});

export default router;
