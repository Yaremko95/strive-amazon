const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const CartSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
CartSchema.static("existsInCart", async function (prodId) {
  const product = await CartModel.findOne({ productId: prodId });
  if (product) {
    return product;
  }
  return null;
});
const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;
