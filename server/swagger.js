const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const m2schema = require("mongoose-to-swagger");

const options = {
  definition: {
    components: {
      schemas: {
        Grade: m2schema(require("./models/grades")),
      },
    },
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "A simple Express API with CRUD operations",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

console.log(specs)

module.exports = {swaggerDocs: (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}};