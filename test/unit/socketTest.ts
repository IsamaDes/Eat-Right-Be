// test/unit/socketTest.ts
import { io as Client, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:5000"; 

// Connect client
const socket: Socket = Client(SERVER_URL);

socket.on("connect", () => {
  console.log("Connected to server, socket id:", socket.id);

  // Test sending a message
  const testMessage = {
    senderId: "user1",
    receiverId: "user2",
    text: "Hello from test client!",
  };

  console.log("Sending message:", testMessage.text);
  socket.emit("chat:message", testMessage);
});

// Listen for incoming messages
socket.on("chat:message", (message) => {
  console.log("Received message from server:", message);
});


socket.on("disconnect", () => {
  console.log("Disconnected from server");
});


socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
