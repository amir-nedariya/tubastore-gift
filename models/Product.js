const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, default: "Other" },
    stock: { type: Number, default: 0, min: 0 },
    offer: { type: Number, min: 0, max: 70, default: 0 },
    discountedPrice: { type: Number, default: 0 }, // 🔹 added
  },
  { timestamps: true }
);

// 🔹 calculate discountedPrice automatically
productSchema.pre("save", function (next) {
  if (this.offer > 0) {
    this.discountedPrice = this.price - (this.price * this.offer) / 100;
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
