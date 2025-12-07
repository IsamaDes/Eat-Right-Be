import ChatRepository from "../repositories/chatRepository";

export default class ChatService {
  static async getMessages(senderId: string, receiverId: string) {
    return ChatRepository.findMessages(senderId, receiverId);
  }

  static async sendMessage(data: {
    senderId: string;
    receiverId: string;
    message: string;
    messageType: string;
  }) {
    return ChatRepository.createMessage(data);
  }
}
