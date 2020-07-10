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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.static("getReviewsByProductID", async function (id) {
  const reviews = await ReviewModel.find(id);
  return reviews;
});
const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;
