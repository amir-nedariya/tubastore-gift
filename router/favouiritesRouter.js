// addprodectRouterfavouirites
const express = require('express');
const { authenticateToken } = require('../Middleware/authMiddleware');
const { productfavourate, getproductfavourate, deleteproductfavourate } = require('../controllers/favouiritesController');
const router = express.Router();

//add products to favourates 
router.put('/product/favourate/:Id',authenticateToken,productfavourate);

//remove to favourates 
router.put('/deleteproduct/favourate/:Id',authenticateToken,deleteproductfavourate);

//get All products
router.get('/getproduct/favourate',authenticateToken,getproductfavourate)
module.exports = router;