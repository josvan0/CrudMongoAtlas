'use strict'

// ********** modules **********

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// ********** consts **********

const PORT = process.env.PORT || 9000;
const app = express();

// ********** database **********

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    email: { type: String, required: true },
    pass: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ********** middlewares **********

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} ${req.ip}`);
    next();
});

// ********** routes **********

app.get('/', (req, res) => {
    res.redirect('/api');
});

app.get('/api', (req, res) => {
    res.sendFile(`${__dirname}/views/api.html`);
});

app.route('/api/users/:userId?')
    .get((req, res) => { })
    .post((req, res) => { })
    .put((req, res) => { })
    .delete((req, res) => { });

// ********** server **********

app.listen(PORT, () => {
    console.log(`Listen on http://localhost:${PORT}`);
});
