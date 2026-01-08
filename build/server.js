"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const http_1 = require("http");
const sockets_1 = require("./sockets");
const server = (0, http_1.createServer)(app_1.default);
(0, sockets_1.initSocket)(server);
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await (0, db_1.connectDB)();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Server failed to start due to DB error.");
        process.exit(1);
    }
}
startServer();
