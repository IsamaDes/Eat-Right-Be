import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";
import getClientProfile from "../controllers/client/clientController";



// Clients can access their profile
router.get(
  "/profile",
  protect,                
  authorizeRoles("client"), 
  getClientProfile
);

export default router;
