import dotenv from "dotenv";
dotenv.config();

console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY ? process.env.PAYSTACK_SECRET_KEY : "Missing ❌");


import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes";
import nutritionistRoutes from "./routes/nutritionistRoutes"
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes"
import chatRoutes from "./routes/chatRoutes"
import subscriptionRoutes from "./routes/subscriptionRoutes"


import { NotFoundError } from "./errors";
import {
  errorHandler,
} from "./middleware/errorMiddleware";
import { initializePaystackTransaction } from "./utils/paystack";

const app = express();
app.post("/test-paystack", async (req: Request, res: Response) => {
  try {
    // Hard-coded test data
    const payload = {
      amount: 1000, // 10 NGN in kobo
      email: "client@example.com", // any email
      reference: `test_${Date.now()}`,
      currency: "NGN",
      callback_url: "https://example.com/payment-success",
    };

    const response = await initializePaystackTransaction(payload);
    console.log("Paystack response:", response);

    return res.json({
      message: "Paystack test successful",
      authorization_url: response.data.authorization_url,
    });
  } catch (error: any) {
    console.error("Paystack test failed:", error.response?.data || error.message);
    return res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

app.use(
  helmet({
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
  })
);

app.use(
  cors({
    origin: ["https://eat-right-fe.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json()); // This is required to parse JSON bodies... was getting wrong input without it.... has to be before routes

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("API is running"));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);
app.use("/nutritionist", nutritionistRoutes);
app.use("/users", userRoutes);
app.use("/chats", chatRoutes)
app.use("/subscriptions", subscriptionRoutes);
app.get("/test-paystack-key", (req, res) => {
  res.json({ key: process.env.PAYSTACK_SECRET_KEY });
});

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});
app.use(errorHandler);

export default app;
