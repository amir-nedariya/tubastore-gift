const express = require("express");
const multer = require("multer");
const { authenticateToken, isAdmin } = require("../Middleware/authMiddleware");
const { addProduct, updateProduct, deleteProduct, getProducts, getProductById, getProductsrecently } = require("../controllers/productController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
//add prodect with Admin
router.post("/", authenticateToken, isAdmin, upload.single("url"), addProduct);
//updated prodect with Admin
router.put("/:id", authenticateToken, isAdmin, upload.single("url"), updateProduct);
//deleted prodect with Admin
router.delete("/:id", authenticateToken, isAdmin, deleteProduct);

//get all products
router.get("/", getProducts); 

//recently add but category check har category 1 hi bar aaye 
router.get('/recently',getProductsrecently); 

// get single product
router.get("/:id", getProductById);



module.exports = router;
