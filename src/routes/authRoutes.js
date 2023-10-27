const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')

const router = express.Router();

router.post('/signup', async (req, res) => {
    const {email, password} = req.body

    try {
        const user = new User({email, password})
        await user.save();
     
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY') // First arg is the piece of information of the user that we want to put into the token and the second arg is the key to encrypt our server users info
        return res.status(200).send({token, email}) 
    } catch (e) {
        return res.status(400).send(e.message)
    }
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(422).send({error: 'Must provide credentials'})
    }

    const user = await User.findOne({email})
    if (!user){
        return res.status(422).send({error: 'Wrong credentials'})
    }
    try {
        await user.comparePassword(password) // this is the method we defined in our model to compare the passwords
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY')  // if the passw matches we want to sign the user id with a jwt token
        res.send({token, email})
    } catch (error) {
        return res.status(422).send({error: 'Wrong credentials'})
    }
})

module.exports = router;