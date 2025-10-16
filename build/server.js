"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js"));
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
const startServer = async () => {
    try {
        await (0, db_js_1.default)();
        console.log("Database connected successfully");
        const server = app_js_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        const shutdown = (signal) => {
            console.log(`${signal} received, shutting down gracefully`);
            server.close(() => {
                console.log("Process terminated");
                process.exit(0);
            });
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
        server.on("error", (err) => {
            console.error("Server error:", err);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
