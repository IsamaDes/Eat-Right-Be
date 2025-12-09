import app from "./app";
import {connectDB} from "./config/db";
import http from "http";
import { initSocket } from "./sockets";

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); 
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start due to DB error.");
    process.exit(1); 
  }
}

startServer();
