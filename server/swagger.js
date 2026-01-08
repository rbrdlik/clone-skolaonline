const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const m2schema = require("mongoose-to-swagger");

const options = {
  definition: {
    components: {
      schemas: {
        Class: m2schema(require("./models/class")),
        User: m2schema(require("./models/user")),
        Grade: m2schema(require("./models/grade")),
        Group: m2schema(require("./models/group")),
        Message: m2schema(require("./models/message")),
        Schedule: m2schema(require("./models/schedule")),
        ScheduleChanges: m2schema(require("./models/scheduleChanges")),
        Subject: m2schema(require("./models/subject")),
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