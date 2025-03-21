const jwt = require('jsonwebtoken')
const User = require('../models/userModel.js')

const requireAuth = async (req, res, next) => {
    // verify authentication
    const {authorization} = req.headers;

    if (!authorization){
        return res.status(402).json({error: "Authorization token required"});
    }

    const token = authorization.split(' ')[1];  // Since it will be something like `Bearer ${token}`

    try{
        const {id} = jwt.verify(token, process.env.SECRET);

        req.user = await User.findOne({_id: id}).select('_id');
        next();
    } catch(error){
        console.error(error);
        res.status(402).json({error: "Request is not authorized"});
    }
}

module.exports = requireAuth