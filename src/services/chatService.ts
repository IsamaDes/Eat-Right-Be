import ChatRepository from "../repositories/chatRepository";
import { prisma } from "../lib/prisma";


export default class ChatService {
  static async getMessages(senderId: string, receiverId: string) {
    return ChatRepository.findMessages(senderId, receiverId);
  }

  static async sendMessage(senderId: string, receiverId: string, message: string, messageType: string) {

  const sender = await prisma.user.findUnique({ where: { id: senderId } });
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

  if (!sender || !receiver) {
    throw new Error("Invalid senderId or receiverId: User does not exist");
  }

    const saved = await ChatRepository.createMessage(senderId, receiverId, message, messageType);

  return prisma.chatMessage.findUnique({
    where: { id: saved.id },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  }
}