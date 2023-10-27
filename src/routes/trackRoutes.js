const express = require('express')
const mongoose = require('mongoose')
const requireAuth = require('../middlewares/requireAuth')

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth); // ensure that the user needs to be signed in

router.get('/tracks', async (req, res) => {
    const tracks = await Track.find({userId: req.user._id}) // find all the tracks in the database for the userId stored in the req.user object that was created with the auth middleware
    res.send(tracks)
});

router.post('/tracks', async (req, res) => {
    const {name, locations} = req.body;

    if(!name || !locations){
        return res.status(422).send({error: 'You must provide a name and location'});
    }
    try {
        const track = new Track({name, locations, userId: req.user._id})
        await track.save();
        res.send(track);
        
    } catch (error) {
        res.status(422).send({error: 'We were not able to save your track'})
    }
});

module.exports = router