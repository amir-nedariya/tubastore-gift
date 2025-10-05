const express = require('express');
const { registerUser, loginUser, getUserInfo, updatedaddress, updatedpassword } = require('../controllers/userController');
const { authenticateToken } = require('../Middleware/authMiddleware');
const router = express.Router();

//register & login
router.post('/register',registerUser);
router.post('/login',loginUser);

//get-user -information
router.get('/me',authenticateToken,getUserInfo);

//updated address
router.put('/updated/address', authenticateToken,updatedaddress)

//updatedpassword
router.put('/updated/password', authenticateToken,updatedpassword)
module.exports = router;