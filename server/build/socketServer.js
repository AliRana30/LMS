"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketServer = void 0;
// socketServer.ts
const socket_io_1 = require("socket.io");
const initializeSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    io.on("connection", (socket) => {
        console.log(`New user connected: ${socket.id}`);
        // Handle notification events
        socket.on("notification", (data) => {
            try {
                const notificationWithTimestamp = {
                    ...data,
                    timestamp: Date.now(),
                };
                if (data.userId) {
                    // Send to specific user's room
                    io.to(data.userId).emit("newNotification", notificationWithTimestamp);
                    console.log(`Notification sent to user ${data.userId}`);
                }
                else {
                    // Broadcast to all clients except sender
                    socket.broadcast.emit("newNotification", notificationWithTimestamp);
                    console.log("Notification broadcast to all users");
                }
            }
            catch (error) {
                console.error("Error handling notification:", error);
            }
        });
        // Handle disconnection
        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
        });
        // Handle errors
        socket.on("error", (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });
    // Global error handler
    io.engine.on("connection_error", (err) => {
        console.error("Connection error:", err);
    });
    console.log("New User Connected");
    return io;
};
exports.initializeSocketServer = initializeSocketServer;
