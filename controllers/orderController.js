const Order = require("../models/Order");
const Product = require("../models/Product");
const QRCode = require("qrcode"); 
const User = require("../models/User");

// 🔹 Helper function to generate UPI links
const generateUpiLinks = (upiId, name, amount) => {
  const base = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=OrderPayment`;

  return {
    gpay: `tez://upi/pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=OrderPayment`,
    phonepe: `phonepe://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=OrderPayment`,
    paytm: `paytmmp://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=OrderPayment`,
    generic: base
  };
};

// 🔹 Place Order
const placeorder = async (req, res) => {
  try {
    const { products, address, paymentMethod } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: "No products in order" });
    if (!address) return res.status(400).json({ message: "Delivery address is required" });

    // Calculate total price using discountedPrice
    let totalPrice = 0;
    const orderProducts = [];

    for (let item of products) {
      if (!item.product) return res.status(400).json({ message: "Product ID missing in products array" });
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });

      const quantity = item.quantity || 1;
      const priceToUse = product.discountedPrice || product.price; // use discountedPrice if available
      totalPrice += priceToUse * quantity;

      orderProducts.push({
        product: product._id,
        quantity,
        price: product.price,
        offer: product.offer,
        discountedPrice: priceToUse
      });
    }

    // Payment QR Code & UPI links only for Online Payment
    let qrCodeUrl = null;
    let upiLinks = null;
    if (paymentMethod === "Online Payment") {
      const upiId = "9624414019@ibl"; // replace with your UPI ID
      const upiString = `upi://pay?pa=${upiId}&pn=TubaStore&am=${totalPrice}&cu=INR&tn=Order${Date.now()}`;
      qrCodeUrl = await QRCode.toDataURL(upiString);
      upiLinks = generateUpiLinks(upiId, "TubaStore", totalPrice);
    }

    // Create Order
    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalPrice,
      paymentMethod: paymentMethod || "Cash on Delivery",
      address,
      paymentDetails: {
        transactionId: null,
        bankName: null,
        paidAmount: null,
        paymentDate: null,
        receiptUrl: null,
        qrCodeUrl,
      },
    });

    await order.save();

    // Clear cart
    const user = await User.findById(req.user.id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully and cart cleared",
      order,
      upiLinks,
    });
  } catch (error) {
    console.error("Error in placeorder:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔹 Get Order History (User)
const getorderhistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price url offer discountedPrice")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in getorderhistory:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔹 Get All Orders (Admin)
const getallorder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username phone")
      .populate("products.product", "name price url offer discountedPrice")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in getallorder:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔹 Update Order Status (Admin)
const updatestatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;

    if (!status && !paymentMethod) return res.status(400).json({ message: "Status or Payment Method is required" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();

    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error in updatestatus:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔹 Delete Order (Admin)
const deleteorder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      order
    });
  } catch (error) {
    console.error("Error in deleteorder:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = { placeorder, getorderhistory, getallorder, updatestatus,deleteorder};
