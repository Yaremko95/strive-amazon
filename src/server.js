const express = require("express");
const productRoutes = require("./products");
const mongoose = require("mongoose");
const { join } = require("path");
const reviewsRoutes = require("./reviews");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUI = require("swagger-ui-express");
const app = express();

app.use(cors());

app.use(express.json());
const port = process.env.PORT || 3002;

const swaggerDocument = YAML.load(join(__dirname, "./apiDocumentation.yml"));

app.use("/products", productRoutes);
app.use("/reviews", reviewsRoutes);

app.use((error, request, response, next) => {
  if (error.httpRequestStatusCode === 404) {
    response.status(404).send("Not Found");
  } else if (error.httpRequestStatusCode === 400) {
    response.status(400).send("Bad Request");
  } else {
    response.status(500).send("Internal server error");
  }
});
console.log(listEndpoints(app));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

mongoose
  .connect("mongodb://localhost:27017/strivamazon", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
  );
