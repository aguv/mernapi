const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
   //check errors
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
   
   // get email and password
   const { email, password } = req.body;

   try {
    //check user
    let user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({msg: "User doesn't exist"})
    }
    
    //check pass
    const validPass = await bcryptjs.compare(password, user.password);
    if(!validPass) {
        return res.status(400).json({ msg: "Password isn't valid" });
    }
    
    //JWT
    const payload = {
        user: {
            id: user.id
        }
    };
    
    jwt.sign(payload, process.env.secretword, 
        (error, token) => {
            if(error) {
                throw error
            } else {
                res.json({ token });
            }
    });

   } catch (error) {

   }
};

// get what user is auth
exports.userIsAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error'});
    }
};