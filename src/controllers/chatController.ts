import { Request, Response } from "express";
import ChatService from "../services/chatService";
import { io } from "../utils/socket";

export default class ChatController {
  static async getMessages(req: Request, res: Response) {
    try {
      const { senderId, receiverId } = req.query;

      if (!senderId || !receiverId)
        return res.status(400).json({
          success: false,
          message: "sender_id and receiver_id are required",
        });

      const messages = await ChatService.getMessages(
        senderId as string,
        receiverId as string
      );

      res.json({ success: true, data: messages });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { senderId, receiverId, message, messageType } = req.body;

      if (!senderId || !receiverId || !message)
        return res.status(400).json({
          success: false,
          message: "senderId, receiverId & message required",
        });

      const saved = await ChatService.sendMessage({
        senderId,
        receiverId,
        message,
        messageType,
      });

      // Emit socket event to receiver
      io.to(receiverId).emit("new_message", saved);

      res.json({ success: true, data: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
