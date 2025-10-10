const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://eatright-theta.vercel.app"] 
    : ["http://localhost:5173"]; 


app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));



app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("API is running"));
app.use("/api", apiRoutes);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
