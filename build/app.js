"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const nutritionistRoutes_1 = __importDefault(require("./routes/nutritionistRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const errors_1 = require("./errors");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== "test") {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
}
app.use((req, res, next) => {
    console.log("Origin:", req.headers.origin);
    next();
});
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "https:"],
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            "style-src": [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
            ],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: ["https://eatright-theta.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // This is required to parse JSON bodies... was getting wrong input without it.... has to be before routes
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("API is running"));
app.use("/auth", authRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/client", clientRoutes_1.default);
app.use("/nutritionist", nutritionistRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/chats", chatRoutes_1.default);
app.use("/subscriptions", subscriptionRoutes_1.default);
app.use((req, res, next) => {
    next(new errors_1.NotFoundError(`Route ${req.originalUrl} not found`));
});
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
