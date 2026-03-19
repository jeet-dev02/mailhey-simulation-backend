const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MailHey Simulation API",
      version: "1.0.0",
      description: "API documentation for MailHey simulation backend",
    },
    servers: [
      {
        url: "https://mailhey-simulation-backend.vercel.app/api",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync("swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("✅ Swagger JSON generated");