require("dotenv").config(); // Load environment variables
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

// App and server initialization
const app = express();
const server = http.createServer(app);

// Load environment variables
const SOCKET_PORT = process.env.SOCKET_SERVER_PORT || 4000;
const SOCKET_ORIGIN = process.env.SOCKET_ORIGIN;

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: SOCKET_ORIGIN,
        methods: ["GET", "POST"],
    },
});

// User-Socket Mapping
const userSocketMap = {}; // { userId: socketId }

// Helper function to get receiver's socket ID
const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId];
}

// Connection event
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Extract userId from query params
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Broadcast online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} removed from socket mapping`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Export modules
module.exports = {
    io,
    app,
    server,
    getReceiverSocketId,
};