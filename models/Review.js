const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
  },
  {
    versionKey: false,
  }
);

// Virtual with Populate
reviewSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

reviewSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in console.log()
reviewSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
reviewSchema.set("toJSON", { virtuals: true });

const Review = model("Review", reviewSchema);
module.exports = Review;
