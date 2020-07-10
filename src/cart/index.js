const express = require("express");

const CartModel = require("../models/CartModel");
const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    console.log("ok");
    const prodInCart = await CartModel.find().populate("productId");
    res.status(200).send({ data: prodInCart });
  } catch (e) {
    console.log(e);
    e.httpRequestStatusCode = 500;
    next(e);
  }
});
router
  .route("/:prodId/")
  .post(async (req, res, next) => {
    try {
      const prodExists = await CartModel.existsInCart(req.params.prodId);
      if (prodExists) {
        console.log("exists");
        await CartModel.findByIdAndUpdate(prodExists._id, {
          $inc: {
            quantity: 1,
          },
        });
      } else {
        const response = await new CartModel({
          productId: req.params.prodId,
          quantity: 1,
        });
        await response.save();
      }

      res.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await CartModel.findOneAndDelete({ productId: req.params.prodId });
      res.status(200).send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });
router.route("/:prodId/decrement-qty").post(async (req, res, next) => {
  try {
    const prodExists = await CartModel.existsInCart(req.params.prodId);
    if (prodExists.quantity > 1) {
      await CartModel.findByIdAndUpdate(prodExists._id, {
        $inc: {
          quantity: -1,
        },
      });
    }

    res.status(200).send("ok");
  } catch (e) {
    e.httpRequestStatusCode = 500;
    next(e);
  }
});

router.route("/:prodId/").delete(async (req, res, next) => {
  try {
    const prodExists = await CartModel.existsInCart(req.params.prodId);
    await CartModel.findByIdAndDelete(prodExists._id);

    res.status(200).send("ok");
  } catch (e) {
    e.httpRequestStatusCode = 500;
    next(e);
  }
});
module.exports = router;
