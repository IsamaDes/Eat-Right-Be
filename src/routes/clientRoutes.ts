import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import getClientProfile from "../controllers/client/clientController.js";



// Clients can access their profile
router.get(
  "/profile",
  protect,                
  authorizeRoles("client"), 
  getClientProfile
);

export default router;
