// src/sockets/index.ts
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ChatGateway } from "./chat.gateway";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://eatright-theta.vercel.app"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    // Initialize all gateways
    ChatGateway(socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
