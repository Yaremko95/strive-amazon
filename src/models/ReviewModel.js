const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ReviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      max: 5,
      min: 0,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;
