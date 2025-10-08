"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_1 = __importDefault(require("./routes/index"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const auth_1 = __importDefault(require("./middleware/auth"));
const swagger_1 = __importDefault(require("./config/swagger"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// --- Middleware ---
app.use((0, cors_1.default)({
    origin: [
        "https://todo-frontend-rosy-five.vercel.app",
        "http://localhost:3000",
        "http://localhost:5000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// --- Swagger ---
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// --- Routes ---
app.get("/", (req, res) => {
    res.send("API is running");
});
app.get("/api/profile", auth_1.default, async (req, res) => {
    res.json({ profile: req.user });
});
app.use("/api", index_1.default);
// --- Error Handling ---
app.use(errorMiddleware_1.errorHandler);
app.use(errorMiddleware_1.notFound);
// --- Start Server ---
const startServer = async () => {
    try {
        await (0, db_1.default)();
        console.log("Database connected successfully");
        const server = app.listen(PORT, () => {
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
