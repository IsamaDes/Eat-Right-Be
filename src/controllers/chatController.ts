import { Response } from "express";
import ChatService from "../services/chatService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export default class ChatController {
  static async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const receiverId = req.user?._id;
      const senderId = req.params.receiverId;
        if (!receiverId )
        return res.status(400).json({
          success: false,
          message: "receiverId is required",
        });
      if (!senderId )
        return res.status(400).json({
          success: false,
          message: "senderId is required",
        });

      const messages = await ChatService.getMessages( senderId, receiverId);

      res.json({ success: true, data: messages });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

}
