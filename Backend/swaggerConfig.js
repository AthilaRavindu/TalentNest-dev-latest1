import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const doc = {
  openapi: "3.0.0",
  info: {
    title: "TalentNest API",
    description: "API documentation for the TalentNest backend",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js", "./controllers/userController.js"];

const options = {
  openapi: "3.0.0",
  disableLogs: false,
  writeOutputFile: true,
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
  autoResponses: true
};

swaggerAutogen(options)(outputFile, routes, doc).then(async () => {
  const swaggerOutput = JSON.parse(await fs.promises.readFile(outputFile, "utf-8"));

  // Remove the `swagger` field if it exists
  if (swaggerOutput.swagger) {
    delete swaggerOutput.swagger;
  }

  // Write the updated file back
  await fs.promises.writeFile(outputFile, JSON.stringify(swaggerOutput, null, 2));

  console.log("Swagger documentation generated successfully.");
});
