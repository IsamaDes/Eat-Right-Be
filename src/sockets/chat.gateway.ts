// src/sockets/chat/chatGateway.ts
import { Socket } from "socket.io";
import { ChatService } from "./chat.service";

export const ChatGateway = (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Optional: store userId on socket for easier targeting
  // socket.data.userId = someUserId;

  // Listen for messages from client
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const savedMessage = await ChatService.sendMessage(senderId, receiverId, text);
      console.log("Message sent:", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Listen for client requesting chat history
  socket.on("getChatHistory", async ({ senderId, receiverId }) => {
    try {
      const history = await ChatService.getChatHistory(senderId, receiverId);
      socket.emit("chatHistory", history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
