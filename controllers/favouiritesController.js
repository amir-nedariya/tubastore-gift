const User = require("../models/User");
const Product = require("../models/Product");

// Add or toggle favourite
const productfavourate = async (req, res) => {
  try {
    const userId = req.user.id;      // token se niklega
    const productId = req.params.Id; // URL param se productId lo

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    // 1️⃣ Product exist check
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ User exist check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Already favourite hai kya?
    if (user.favourites.includes(productId)) {
      return res.status(400).json({ message: "Product already in favourites" });
    }

    // 4️⃣ Add to favourites
    user.favourites.push(productId);
    await user.save();

    res.status(200).json({
      message: "Product added to favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("Error adding product to favourites:", error);
    res.status(500).json({
      message: "Error adding favourite",
      error: error.message,
    });
  }
};

// Remove favourite explicitly
const deleteproductfavourate = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.Id;

    const user = await User.findById(userId);
    const index = user.favourites.indexOf(productId);

    if (index === -1) {
      return res.status(400).json({ message: "Product is not in favourites" });
    }

    user.favourites.splice(index, 1);
    await user.save();
    return res.status(200).json({ message: "Product removed from favourites", favourites: user.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all favourites of the user
const getproductfavourate = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favourites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { productfavourate, deleteproductfavourate, getproductfavourate };
