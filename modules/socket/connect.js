
function SocketModule(server) {
    const io = require('socket.io')(server);
    require('dotenv').config();
    const { IncrementDriver, DecrementDriver } = require('./activeDrivers');
    const jwt = require('jsonwebtoken');
    // const StartQueue = require('./getDriverQueue');
    // StartQueue(io)

    io.on('connection', (socket) => {
        const { token } = socket.handshake.query;
        const coopId = jwt.verify(token, process.env.SECRET).coopId;
        IncrementDriver(coopId);

        socket.on('disconnect', () => {
            DecrementDriver(coopId);
        });
    });
}

module.exports = SocketModule;