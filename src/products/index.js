const express = require("express");
const axios = require("axios");
const { xml2js } = require("xml-js");
const path = require("path");
const {
  check,
  query,
  validationResult,
  sanitizeQuery,
} = require("express-validator");
const router = express.Router();
const {
  readJSON,
  writeJSON,
  updateData,
  removeData,
  buildXML,
} = require("../utilitties");
const fileDirectory = path.join(__dirname, "products.json");

const validateBody = () => {
  return [
    check("name")
      .exists()
      .withMessage("name is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("description")
      .exists()
      .withMessage("description is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("brand")
      .exists()
      .withMessage("brand is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),

    check("price").exists().withMessage("price is  required").not().isEmpty(),
  ];
};

router
  .route("/")
  .get(async (request, response, next) => {
    try {
      const json = await readJSON(fileDirectory);
      response.send(json);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(validateBody(), async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      let data = await writeJSON(fileDirectory, request.body);
      console.log(data);
      response.send(data);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

router
  .route("/sum")
  .get(
    [
      query("id1").exists().not().isEmpty().withMessage("Provide query"),
      sanitizeQuery("id1").toFloat(),
      query("id2").exists().not().isEmpty().withMessage("Provide query"),
      sanitizeQuery("id2").toFloat(),
    ],
    async (request, response, next) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      try {
        const { id1, id2 } = request.query;
        console.log(id1, id2);
        const xml = buildXML(id1, id2);

        const res = await axios({
          method: "post",
          url: "http://www.dneonline.com/calculator.asmx?op=Add",
          data: xml,
          headers: { "Content-type": "text/xml" },
        });
        const options = {
          ignoreComment: true,
          alwaysChildren: true,
          compact: true,
        };
        const json = xml2js(res.data, options);
        response.send(json);
      } catch (e) {
        next(e);
      }
    }
  );

router
  .route("/:id")
  .get(async (request, response, next) => {
    try {
      const { id } = request.params;
      const dataArray = await readJSON(fileDirectory);
      const item = dataArray.filter((item) => item._id === id);
      response.send(item);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .put(validateBody(), async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      const { id } = request.params;
      const updatedData = await updateData(fileDirectory, id, request.body);
      response.send(updatedData);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (request, response, next) => {
    try {
      const { id } = request.params;
      const updatedData = await removeData(fileDirectory, "_id", id);
      response.send(updatedData);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

module.exports = router;
