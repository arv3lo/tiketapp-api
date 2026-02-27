import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ticket API",
            version: "1.0.0",
        },
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Development server"
        }
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
    schemas: {
        User: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
            },
        },
    },
    apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;