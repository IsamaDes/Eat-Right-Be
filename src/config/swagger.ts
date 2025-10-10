const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eat Right API",
      version: "1.0.0",
      description: "API documentation for Eat Right app with JWT authentication",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local dev server",
      },
      {
        url: "https://eat-right-be.onrender.com", // Deployed backend
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerDefinition = swaggerJSDoc(options);
module.exports = swaggerDefinition;