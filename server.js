const express = require('express');
const cors = require("cors");
const connectDB = require('./db/conn'); 
const userRoutes = require('./router/userRouter');
const productRoutes = require('./router/productRoutes');
const productfavouratesRoutes = require('./router/favouiritesRouter');
const cardRoutes = require('./router/cardRouter');
const OrderRoutes = require('./router/orderRouter');
const contactRoutes = require('./router/ContatRouter');
const offerRoutes = require('./router/offerRoutes');
const path = require("path");
const fs = require("fs");

const app = express();

// Connect to MongoDB
connectDB();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173","https://tubastore.netlify.app"],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// JSON parsing for normal requests
app.use(express.json());

// Serve static files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api', productfavouratesRoutes);
app.use('/api', cardRoutes);
app.use('/api', OrderRoutes);
app.use('/api',contactRoutes);
app.use('/api/offers',offerRoutes);


// Test root route
app.get('/', (req, res) => {
    res.send('Hello from the other side!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
