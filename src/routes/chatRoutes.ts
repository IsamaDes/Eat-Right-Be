import { Router } from "express";
import ChatController from "../controllers/chatController";

const router = Router();

router.get("/chat-messages", ChatController.getMessages);
router.post("/chat-messages", ChatController.sendMessage);

export default router;
