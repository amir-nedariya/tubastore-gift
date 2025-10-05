const express = require('express');
const { authenticateToken } = require('../Middleware/authMiddleware');
const { productcart, deleteproductcard, getproductcard } = require('../controllers/cardController');

const router = express.Router();

//add to card
router.put('/product/card/:Id',authenticateToken,productcart);

// delete to card
router.put('/deleteproduct/card/:Id',authenticateToken,deleteproductcard);

//get card of particular user
router.get('/getproduct/card',authenticateToken,getproductcard)
module.exports = router;