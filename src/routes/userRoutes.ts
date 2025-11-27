import { Router } from "express";
import { getUserProfile } from "../controllers/user/userController";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

const router = Router();

router.get(
  "/users/:id",
  cacheMiddleware(req => `user:${req.params.id}`, 3600), 
  getUserProfile
);

export default router;
