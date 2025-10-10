import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { getClientProfile } from "../controllers/client/clientController";
const router = Router();
// Clients can access their profile
router.get("/profile", protect, authorizeRoles("client"), getClientProfile);
export default router;
