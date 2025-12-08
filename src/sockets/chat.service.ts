// src/sockets/chat/chatService.ts
import { getIO } from "./index";
import { prisma } from "../lib/prisma";

export const ChatService = {
  async sendMessage(senderId: string, receiverId: string, message: string) {
    // Save message to database
    const chatMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message: message,
      },
    });

    // Broadcast message to both sender and receiver
    const io = getIO();
    io.to(senderId).emit("receiveMessage", chatMessage);
    io.to(receiverId).emit("receiveMessage", chatMessage);

    return chatMessage;
  },

  async getChatHistory(senderId: string, receiverId: string) {
    return prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  },
};
