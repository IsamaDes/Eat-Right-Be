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
const swagger_js_1 = __importDefault(require("./config/swagger.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const clientRoutes_js_1 = __importDefault(require("./routes/clientRoutes.js"));
const nutritionistRoutes_js_1 = __importDefault(require("./routes/nutritionistRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.default));
app.get("/", (req, res) => res.send("API is running"));
app.use("/auth", authRoutes_js_1.default);
app.use("/admin", adminRoutes_js_1.default);
app.use("/client", clientRoutes_js_1.default);
app.use("/nutritionist", nutritionistRoutes_js_1.default);
app.use(errorMiddleware_js_1.errorHandler);
app.use(errorMiddleware_js_1.badRequest);
app.use(errorMiddleware_js_1.invalidCredentials);
app.use(errorMiddleware_js_1.notFound);
exports.default = app;
