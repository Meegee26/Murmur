import { Server } from "socket.io";
import http from "http";
import express from "express";
import { FRONTEND_URL } from "../config/env.js";

const app = express();
const server = http.createServer(app);

let io;
const userSocketMap = new Map();

export const initializeSocket = () => {
  io = new Server(server, {
    cors: {
      origin: [FRONTEND_URL],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap.set(userId, socket.id);
      socket.join(`user:${userId}`);
      console.log(`User ${userId} connected`);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
      if (userId) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
};

export const emitNewChatToParticipants = (participantIds = [], chat) => {
  const ioInstance = getIO();
  participantIds.forEach((id) => {
    ioInstance.to(`user:${id}`).emit("chat:new", chat);
  });
};

export const emitNewMessageToChat = (
  participantIds = [],
  message,
  senderId,
) => {
  const ioInstance = getIO();

  participantIds.forEach((id) => {
    if (id.toString() !== senderId.toString()) {
      ioInstance.to(`user:${id}`).emit("message:new", message);
    }
  });
};

export const getReceiverSocketId = (userId) => userSocketMap.get(userId);

export { app, server };
