const express = require("express");
const q2m = require("query-to-mongo");
const queryString = require("query-string");
const ProductModel = require("../models/ProductModel");
const ReviewModel = require("../models/ReviewModel");
const CartModel = require("../models/CartModel");
const { writeFile } = require("fs-extra");
const multer = require("multer");
const upload = multer({});
const router = express.Router();
const { join } = require("path");

const imageFolderPath = join(__dirname, "../images/");
router
  .route("/")
  .get(async (request, response, next) => {
    try {
      const { query } = request;
      const page = query.page;
      delete query.page;
      const queryToMongo = q2m(query);
      const criteria = queryToMongo.criteria;

      for (let key in criteria) {
        if (typeof criteria[key] !== "object") {
          criteria[key] = { $regex: `${criteria[key]}`, $options: "i" };
        }
      }
      console.log(criteria);
      const products = await ProductModel.find(criteria)
        .skip(10 * page)
        .limit(10);
      const numOfProducts = await ProductModel.count(criteria);

      response.status(200).send({
        data: products,
        currentPage: page,
        pages: Math.ceil(numOfProducts / 10),
        results: numOfProducts,
      });
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(async (request, response, next) => {
    try {
      const res = await new ProductModel({
        ...request.body,
        price: parseInt(request.body.price),
      });
      const { _id } = await res.save();
      response.send(_id);
    } catch (e) {
      console.log(e);
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

// router
//   .route("/sum")
//   .get(
//     [
//       query("id1").exists().not().isEmpty().withMessage("Provide query"),
//       sanitizeQuery("id1").toFloat(),
//       query("id2").exists().not().isEmpty().withMessage("Provide query"),
//       sanitizeQuery("id2").toFloat(),
//     ],
//     async (request, response, next) => {
//       const errors = validationResult(request);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ errors: errors.array() });
//       }
//       try {
//         const { id1, id2 } = request.query;
//         console.log(id1, id2);
//         const xml = buildXML(id1, id2);
//
//         const res = await axios({
//           method: "post",
//           url: "http://www.dneonline.com/calculator.asmx?op=Add",
//           data: xml,
//           headers: { "Content-type": "text/xml" },
//         });
//         const options = {
//           ignoreComment: true,
//           alwaysChildren: true,
//           compact: true,
//         };
//         const json = xml2js(res.data, options);
//         response.send(json);
//       } catch (e) {
//         next(e);
//       }
//     }
//   );

router
  .route("/:id")
  .get(async (request, response, next) => {
    try {
      const { id } = request.params;
      const product = await ProductModel.findById(id);
      response.status(200).send(product);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .put(async (request, response, next) => {
    try {
      const { id } = request.params;
      console.log(request.body);
      const res = await ProductModel.findByIdAndUpdate(id, request.body);
      response.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (request, response, next) => {
    try {
      const { id } = request.params;
      const res = await ProductModel.findByIdAndDelete(id);
      response.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

// router.route("/:id/exportToPDF").get(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//
//     const doc = await getPdf(req.body, (doc) => {
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=${req.body.name}.pdf`
//       );
//       doc.pipe(res);
//       doc.end();
//     });
//   } catch (e) {
//     e.httpRequestStatusCode = 500;
//     next(e);
//   }
// });

router
  .route("/:id/upload")
  .post(upload.single("avatar"), async (req, res, next) => {
    try {
      await writeFile(
        join(imageFolderPath, req.file.originalname),
        req.file.buffer
      );
      res.s(200).send("ok");
    } catch (e) {}
  });

module.exports = router;
