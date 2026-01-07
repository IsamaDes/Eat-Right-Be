import { Socket } from "socket.io";
import  ChatService  from "../services/chatService";
import { getChatRoomId } from "../utils/chatRoom";
import { getIO } from "./index";

export const ChatGateway = (socket: Socket) => {

  console.log(`Client connected: ${socket.id}`);

  socket.on("join_room", ({ userId, receiverId }) => {
  const roomId = getChatRoomId(userId, receiverId);
  socket.join(roomId);

  console.log(`User ${userId} joined room ${roomId}`);
});


  socket.on("sendMessage", async ({ senderId, receiverId, message, messageType }) => {
    try {
      const savedMessage = await ChatService.sendMessage(senderId, receiverId, message, messageType);
      const roomId = getChatRoomId(senderId, receiverId);
      const io = getIO();
      io.to(roomId).emit("new_message", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });


  socket.on("join_room", (payload) => {
  console.log("JOIN ROOM:", payload);
});

socket.on("sendMessage", (payload) => {
  console.log("SEND MESSAGE:", payload);
});
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
