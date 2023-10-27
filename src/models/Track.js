const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
})

const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //this is how we indicate that userID is pointing to an iinstance of the model User
    },
    name: {
        type: String,
        default: ''
    },
    locations: [pointSchema]
});

mongoose.model('Track', trackSchema) // notice we dont pass pointSchema to mongo as we dont want a collection of pointSchema instead all of those point objects are embeded inside trackSchema