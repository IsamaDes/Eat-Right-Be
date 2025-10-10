const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

/** @type {import('cors').CorsOptions} */

const allowedOrigins = [
  "http://localhost:5173",             
  "https://eat-right-fe.vercel.app",  
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked request from origin: ${origin}`);
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: any, res: any) => res.send("API is running"));
app.use("/api", apiRoutes);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
