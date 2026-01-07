import { Router } from "express";
import ChatController from "../controllers/chatController";
import protect from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/get-messages/:receiverId", ChatController.getMessages);

export default router;
