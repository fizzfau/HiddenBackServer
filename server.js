const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

mongoose.connect('mongodb+srv://nodejsdatabase:9wfmXiEOjHBnA9oZ@cluster0.eakp9te.mongodb.net/test'); // 9wfmXiEOjHBnA9oZ
const db = mongoose.connection;
const RegisterRoute = require('./routes/auth');
const TestData = require('./routes/data');

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



app.use('/api', [RegisterRoute, TestData]);

app.get('/test', (req, res) => {
    console.log('test');
    res.send('Hello!');
});