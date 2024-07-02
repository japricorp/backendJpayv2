const socketIo = require('socket.io');
const {query} = require("../utils/database")
require('dotenv').config();
const AUTH_TOKEN = process.env.TOKEN_SOCKET

const initializeSocket = (server) => {
    const io = socketIo(server);

    // Middleware untuk memverifikasi token
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token === AUTH_TOKEN) {
            return next();
        }
        return next(new Error('Authentication error'));
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('fcm',  async (data) => {
            const update = query("UPDATE members SET token = ? WHERE phone = ?",[data.token,data.phone])
        });
    });

    

    return io;
};

module.exports = initializeSocket;
