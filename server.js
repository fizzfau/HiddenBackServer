require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

mongoose.connect(process.env.DATABASE_URI);
const db = mongoose.connection;
const RegisterRoute = require('./routes/auth');
const GetData = require('./routes/data');
const Increment = require('./routes/increment');
const Decrement = require('./routes/decrement');

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

db.once("open", ()=>{
    console.log("Connection Successful!");
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.use('/api', [RegisterRoute, GetData, Increment, Decrement]);

app.get('/', (req, res) => {

    console.log('test');
    res.send('Hello!');
});

app.get('/test', (req, res) => {
    console.log('test');
});