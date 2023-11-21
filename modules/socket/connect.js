function SocketModule(server) {
    const io = require('socket.io')(server);

    console.log('socket module loaded');

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

module.exports = SocketModule;