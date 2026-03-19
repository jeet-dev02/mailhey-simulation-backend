import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MailHey Simulation API",
      version: "1.0.0",
      description: "API documentation for MailHey simulation backend including email operations, user validation, and updates.",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
    tags: [
      {
        name: "Emails",
        description: "Email related APIs",
      },
      {
        name: "User",
        description: "User related APIs",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts", "./src/app/api/**/*.js"], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);