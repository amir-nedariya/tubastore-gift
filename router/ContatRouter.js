const express = require('express');
const { authenticateToken, isAdmin } = require('../Middleware/authMiddleware');
const { addcontact, getallcontact, deletecontact } = require('../controllers/contactControllers');

const router = express.Router();

router.post('/contact',authenticateToken,addcontact);
router.get('/getallContact',authenticateToken,isAdmin,getallcontact);
router.delete('/deletecontact/:Id',authenticateToken,isAdmin,deletecontact);

module.exports = router;