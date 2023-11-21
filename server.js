require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const SocketModule = require('./modules/socket/connect');

mongoose.connect(process.env.DATABASE_URI);
const db = mongoose.connection;
const RegisterRoute = require('./routes/auth');
const Delete = require('./routes/deleteAccount');
const GetDriverData = require('./routes/drivers/getDriverData');
const GetJobs = require('./routes/drivers/getJobs');

const Routes = [
    RegisterRoute,
    Delete,
    GetDriverData,
    GetJobs
];


db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});


const app = express();
const http = require('http').Server(app);
SocketModule(http)

db.once("open", ()=>{
    console.log("Connection Successful!");
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.use('/api', Routes);

app.get('/', (req, res) => {
    res.send('Hello!');
});