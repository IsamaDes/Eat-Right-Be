import Chat from "../models/Chat";

export default class ChatService {
  static async getMessages(sender_id: string, receiver_id: string) {
    return await Chat.find({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    }).sort({ createdAt: 1 });
  }

  static async sendMessage(data: {
    sender_id: string;
    receiver_id: string;
    message: string;
    message_type: string;
  }) {
    const msg = await Chat.create(data);
    return msg;
  }
}
