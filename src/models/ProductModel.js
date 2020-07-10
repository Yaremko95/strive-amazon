const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const v = require("validator");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (url) => {
          if (!v.isURL(url)) {
            throw new Error("url: not valid");
          }
        },
      },
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("Product", ProductSchema);
module.exports = ProjectModel;
