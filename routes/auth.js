const express = require('express');
const router = express.Router();
const { check } = require('express-validator');  
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// login
// api/auth
router.post('/',
    authController.authUser);

router.get('/',
    auth,
    authController.userIsAuth);


module.exports = router;