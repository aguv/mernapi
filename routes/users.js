const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');  

//create user


// api/users
router.post('/',
    [
        check('name', 'Name required').not().isEmpty(),
        check('email', 'Use a valid email').isEmail(),
        check('password', '6 character minimum').isLength({ min: 6 })
    ],
    userController.createUser);

module.exports = router;