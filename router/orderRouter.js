const express = require('express');
const { authenticateToken, isAdmin } = require('../Middleware/authMiddleware');
const { placeorder, getorderhistory, getallorder, updatestatus, deleteorder } = require('../controllers/orderController');

const router = express.Router();

//place order
router.post('/place/order',authenticateToken,placeorder);
//get order history of particular User
router.get('/get/order/history',authenticateToken,getorderhistory)


//get-all-orders---admin
router.get('/getall/order',authenticateToken,isAdmin,getallorder);
//update order ---admin
router.put('/update/status/:id',authenticateToken,isAdmin,updatestatus);
// delete order --- admin
router.delete('/delete/order/:id',authenticateToken,isAdmin,deleteorder);
module.exports = router;