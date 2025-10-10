import swaggerJSDoc from "swagger-jsdoc";
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
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
