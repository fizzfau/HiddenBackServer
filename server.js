require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const SocketModule = require('./modules/socket/connect');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URI);
const db = mongoose.connection;
const RegisterRoute = require('./routes/auth');
const Delete = require('./routes/deleteAccount');
const GetDriverData = require('./routes/drivers/getDriverData');
const GetJobs = require('./routes/drivers/getJobs');
const GetQueue = require('./modules/socket/getDriverQueue');
const AdminRoutes = require('./routes/admin/adminRoutes');

const Routes = [
    RegisterRoute,
    Delete,
    GetDriverData,
    GetJobs,
    
];


db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});


const app = express();
const http = require('http').createServer(app);
SocketModule(http)

db.once("open", ()=>{
    console.log("Connection Successful!");
    http.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors());

app.use('/api', Routes);
app.use('/admin', AdminRoutes)


app.get('/', (req, res) => {
    const { GetDrivers } = require('./modules/socket/activeDrivers');
    console.log(GetDrivers("12345"));
    res.json(GetDrivers("12345"));
});