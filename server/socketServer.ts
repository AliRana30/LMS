// socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import http from "http";

// Define socket event types for type safety
interface ServerToClientEvents {
  newNotification: (data: NotificationData) => void;
}

interface ClientToServerEvents {
  notification: (data: NotificationData) => void;
  joinRoom: (userId: string) => void;
  leaveRoom: (userId: string) => void;
}

interface NotificationData {
  userId?: string;
  message: string;
  type: string;
  timestamp: number;
  [key: string]: any;
}

export const initializeSocketServer = (httpServer: http.Server) => {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle notification events
    socket.on("notification", (data: NotificationData) => {
      try {
        const notificationWithTimestamp = {
          ...data,
          timestamp: Date.now(),
        };

        if (data.userId) {
          // Send to specific user's room
          io.to(data.userId).emit("newNotification", notificationWithTimestamp);
          console.log(`Notification sent to user ${data.userId}`);
        } else {
          // Broadcast to all clients except sender
          socket.broadcast.emit("newNotification", notificationWithTimestamp);
          console.log("Notification broadcast to all users");
        }
      } catch (error) {
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