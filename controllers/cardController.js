const User = require('../models/User');  // User model
const Product = require('../models/Product'); // Product model

// Add product to cart
const productcart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.Id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    user.cart.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove product from cart
const deleteproductcard = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.Id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(p => p.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's cart
const getproductcard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cart");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { productcart, deleteproductcard, getproductcard };
