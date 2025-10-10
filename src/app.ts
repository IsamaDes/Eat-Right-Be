const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(
  cors({
    origin: [
      "https://eat-right-fe.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
  })
);


app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: any, res: any) => res.send("API is running"));
app.use("/api", apiRoutes);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
