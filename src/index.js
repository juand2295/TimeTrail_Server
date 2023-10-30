require('./models/User'); //we need to execute our models just one time in the whole directory and it needs to be at the begining so we execute it here in index.js
require('./models/Track');
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth')

const app = express();

app.use(bodyParser.json()); // needs to be before the routes
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DATABASE_NAME}.sirptvi.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance')
});

mongoose.connection.on('error', (err) => {
    console.error('error connecting to mongo', err)
});

app.get('/', requireAuth, (req, res)=> {
    res.send(`Your email: ${req.user.email}`) //we attached that user instance to the req object in the middleware
});

app.listen(3000, () => {
    console.log('listening on port 3000')
});