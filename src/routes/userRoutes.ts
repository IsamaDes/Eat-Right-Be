import { Router } from "express";
import { getCurrentUser } from "../controllers/user/userController";
import protect from "../middleware/authMiddleware";


const router = Router();

router.use(protect);


router.get(
  "/me",
  getCurrentUser);

export default router;
