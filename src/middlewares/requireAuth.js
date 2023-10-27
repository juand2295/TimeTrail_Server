const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req,res,next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).send({error: 'Please log in'})
    }

    const token =  authorization.replace('Bearer ','');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err){
            return res.status(401).send({error: 'You must be logged in'})
        }

        const {userId} = payload;

        const user = await User.findById(userId); // now we want to attach this user to our req object so any other req handlers that might want info about the user can easily acces them
        req.user = user;
        next()
    });
};