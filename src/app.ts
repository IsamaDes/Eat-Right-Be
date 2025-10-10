import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import apiRoutes from "./routes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(cors({
  origin: [
    "https://todo-frontend-rosy-five.vercel.app",
    "http://localhost:5173",
    "http://localhost:5000",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("API is running"));
app.use("/api", apiRoutes);

app.use(errorHandler);
app.use(notFound);

export default app;
