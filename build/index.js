"use strict";
// import express, { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import swaggerUi from "swagger-ui-express";
// import { notFound, errorHandler } from "./middleware/errorMiddleware";
// import authMiddleware from "./middleware/authMiddleware";
// import swaggerSpec from "./config/swagger";
// import connectDB from "./config/db";
// import apiRoutes from "./routes";
// dotenv.config();
// const PORT = process.env.PORT || 5000;
// const app = express();
// // --- Middleware ---
// app.use(
//   cors({
//     origin: [
//       "https://todo-frontend-rosy-five.vercel.app",
//       "http://localhost:5173",
//       "http://localhost:5000",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(express.json());
// // --- Swagger ---
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// // --- Routes ---
// app.get("/", (req: Request, res: Response) => {
//   res.send("API is running");
// });
// app.get("/api/profile", authMiddleware, async (req: Request, res: Response) => {
//   res.json({ profile: req.user });
// });
// app.use("/api", apiRoutes);
// // --- Error Handling ---
// app.use(errorHandler);
// app.use(notFound);
// // --- Start Server ---
// const startServer = async () => {
//   try {
//     await connectDB();
//     console.log("Database connected successfully");
//     const server = app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//     const shutdown = (signal: string) => {
//       console.log(`${signal} received, shutting down gracefully`);
//       server.close(() => {
//         console.log("Process terminated");
//         process.exit(0);
//       });
//     };
//     process.on("SIGTERM", () => shutdown("SIGTERM"));
//     process.on("SIGINT", () => shutdown("SIGINT"));
//     server.on("error", (err: any) => {
//       console.error("Server error:", err);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };
// startServer();
