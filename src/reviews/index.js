const express = require("express");
const ReviewModel = require("../models/ReviewModel");
const router = express.Router();
router
  .route("/")
  .get(async (request, response, next) => {
    try {
      const reviews = await ReviewModel.find();
      response.status(200).send(reviews);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(async (request, response, next) => {
    try {
      const res = await new ReviewModel(request.body);
      const { _id } = res.save();
      response.send(_id);
    } catch (e) {
      console.log(e);
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

router
  .route("/:id")
  .get(async (request, response, next) => {
    try {
      const { id } = request.params;
      const review = await ReviewModel.findById(id);
      response.status(200).send(review);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .put(async (request, response, next) => {
    try {
      const { id } = request.params;
      const res = await ReviewModel.findByIdAndUpdate(id, request.body);
      response.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (request, response, next) => {
    try {
      const { id } = request.params;
      const res = await ReviewModel.findByIdAndDelete(id);
      response.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

module.exports = router;
