const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(
  cors({
    origin: [
      "https://todo-frontend-rosy-five.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  res.json({ profile: req.user });
});
app.use("/api", routes);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
