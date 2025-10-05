const Product = require("../models/Product");

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock, offer } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newProduct = {
      url: req.file.path,
      name,
      price,
      category,
      stock,
      offer: offer || 0,
      discountedPrice: offer > 0 ? price - (price * offer) / 100 : price, // 🔹 auto discount
    };

    const product = await Product.create(newProduct);

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock, offer } = req.body;

    const updatedData = {
      name,
      price,
      category,
      stock,
      offer: offer || 0,
      discountedPrice: offer > 0 ? price - (price * offer) / 100 : price, // 🔹 auto discount
    };

    if (req.file) updatedData.url = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Recently added products (1 per category)
const getProductsrecently = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sort: { createdAt: -1 } }, // latest first
      {
        $group: {
          _id: "$category",        // group by category
          product: { $first: "$$ROOT" } // take latest product per category
        }
      },
      { $replaceRoot: { newRoot: "$product" } } // just product object
    ]);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getProductsrecently:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  addProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getProductsrecently 
};
