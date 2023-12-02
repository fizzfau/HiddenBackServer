let io = null;
function SocketModule(server) {
    io = require('socket.io')(server);
    require('dotenv').config();
    const { IncrementDriver, DecrementDriver } = require('./activeDrivers');
    const jwt = require('jsonwebtoken');
    const User = require('../../models/User');
    const StartQueue = require('./getDriverQueue');

    io.on("connecting", (socket) => {
        console.log('a user tryin to connect');
    })

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket = socket;
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
function getIo() {
    while (io === null) {
        setTimeout(() => {
            console.log('waiting for io connection');
        }, 5000);
    }
    return io;
}

module.exports = {SocketModule, getIo};