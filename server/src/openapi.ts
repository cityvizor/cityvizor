import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CityVizor API",
      version: "1.0.0",
      description: "Generated from @swagger annotations in the server code.",
    },
    servers: [
      {
        url: "/",
        description: "Current server",
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
  },
  apis: [path.join(__dirname, "routers/**/*.js")],
};

export function getOpenApiSpec(): object {
  return swaggerJSDoc(options);
}
