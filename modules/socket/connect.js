
function SocketModule(server) {
    const io = require('socket.io')(server);
    require('dotenv').config();
    const { IncrementDriver, DecrementDriver } = require('./activeDrivers');
    const jwt = require('jsonwebtoken');
    const User = require('../../models/User');
    // const StartQueue = require('./getDriverQueue');
    // StartQueue(io)


    io.on('connection', (socket) => {
        const { token } = socket.handshake.query;
        const coopId = jwt.verify(token, process.env.SECRET).coopId;
        const userId = jwt.verify(token, process.env.SECRET).userId;
        IncrementDriver(coopId);

        socket.on('disconnect', () => {
            DecrementDriver(coopId);
            User.findOneAndUpdate({ userId }, { $set: { lastEntered: Date.now() } }).exec()
        });


        
    });
}

module.exports = SocketModule;