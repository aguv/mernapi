const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get email and password
    const { email, password } = req.body;

    try {
        // check unique user
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
         
        // create new user
        user = new User(req.body);

        // hash password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // save new user
        await user.save();
        
        // create and sign JSON WEB TOKEN
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
        console.log(error);
        res.status(400).json('Error');
    }
}