const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // read token header
    const token = req.header('x-auth-token');

    console.log(token);

    //  check if token
    if(!token) {
        return res.status(401).json({msg: "There is no token. Permission denied"});
    }

    // validate token
    try {
        const isValid = jwt.verify(token, process.env.secretword);
        req.user = isValid.user;
        next();
    } catch (error) {
        res.status(401).json({msg: "Invalid token"});
    }
}