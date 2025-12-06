import { Request, Response } from "express";
import ChatService from "../services/chatService";
import { io } from "../utils/socket";

export default class ChatController {
  static async getMessages(req: Request, res: Response) {
    try {
      const { sender_id, receiver_id } = req.query;

      if (!sender_id || !receiver_id)
        return res.status(400).json({
          success: false,
          message: "sender_id and receiver_id are required",
        });

      const messages = await ChatService.getMessages(
        sender_id as string,
        receiver_id as string
      );

      res.json({ success: true, data: messages });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { sender_id, receiver_id, message, message_type } = req.body;

      if (!sender_id || !receiver_id || !message)
        return res.status(400).json({
          success: false,
          message: "sender_id, receiver_id & message required",
        });

      const saved = await ChatService.sendMessage({
        sender_id,
        receiver_id,
        message,
        message_type,
      });

      // Emit socket event to receiver
      io.to(receiver_id).emit("new_message", saved);

      res.json({ success: true, data: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
