const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online Payment"],
      default: "Cash on Delivery",
    },
    status: {
      type: String,
      enum: ["Order Placed", "Payment Pending", "Out for Delivery", "Delivered", "Rejected"],
      default: function () {
        return this.paymentMethod === "Online Payment" ? "Payment Pending" : "Order Placed";
      },
    },
    address: {
      type: String,
      required: true,
    },
    paymentDetails: {
      transactionId: { type: String },
      bankName: { type: String },
      paidAmount: { type: Number, min: 0 },
      paymentDate: { type: Date },
      receiptUrl: { type: String },      // user uploaded receipt
      qrCodeUrl: { type: String, default: "/qr/upi.png" }, // static UPI QR code
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
