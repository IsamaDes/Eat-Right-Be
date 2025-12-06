import { Router } from "express";
import { getCurrentUser, getUserProfile } from "../controllers/user/userController";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import protect from "../middleware/authMiddleware";


const router = Router();

router.use(protect);

router.get(
  "/users/:id",
  cacheMiddleware(req => `user:${req.params.id}`, 3600), 
  getUserProfile
);

router.get(
  "/me",
  cacheMiddleware(req => `user:${req.params.id}`, 3600),
  getCurrentUser);

export default router;
