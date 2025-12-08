import { Router } from "express";
import { getCurrentUser } from "../controllers/user/userController";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import protect from "../middleware/authMiddleware";


const router = Router();

router.use(protect);


router.get(
  "/me",
  cacheMiddleware(req => `user:${req.params.id}`, 3600),
  getCurrentUser);

export default router;
