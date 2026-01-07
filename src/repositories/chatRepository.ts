import { prisma } from "../lib/prisma";
import { MessageType } from "@prisma/client";

export default class ChatRepository {
  static async findMessages(senderId: string, receiverId: string) {
  return prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: "asc" },
  });
}

 
  static async createMessage(senderId: string, receiverId: string, message: string, messageType: MessageType | string) {
    return prisma.chatMessage.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        messageType: messageType as MessageType, 
      },
    });
  }
}
