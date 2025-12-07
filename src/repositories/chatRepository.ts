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
      orderBy: { createdAt: "asc" },
    });
  }

 
  static async createMessage(data: {
    senderId: string;
    receiverId: string;
    message: string;
    messageType: MessageType | string;
  }) {
    return prisma.chatMessage.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        messageType: data.messageType as MessageType, 
      },
    });
  }
}
