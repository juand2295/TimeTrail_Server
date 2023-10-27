const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// we will use this pre save functionality to hash the user password before actually save it to the database
userSchema.pre('save', function(next){ // we need to use function instead of arrow fn because we need this to refer to the user passed to the fn and not the global context
    const user = this;
    if (!user.isModified('password')){
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err){
                return next(err)
            }
            user.password = hash;
            next();
        })
    })
})

//then we need to compare the hashed password with the one provided by the user, it could be done in the request but makes more sense to do it here in the model
userSchema.methods.comparePassword = function(providedPassword){
    const user = this; //inside this function 'this' is our user model
    return new Promise((resolve, reject)=> { //we use promises to take advantage of the async await functionality cause the bcrypt library was all written with callbacks and its very annoying
        bcrypt.compare(providedPassword, user.password, (err, isMatch) => {
            if (err){
                return reject(err)
            }
            if (!isMatch) {
                return reject(false)
            }
            resolve(true)
        });
    })
}

mongoose.model('User', userSchema)