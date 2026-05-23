import { Server } from "socket.io";
import Message from "./models/message.model.js";

let io;

// userId -> socketId
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Connected:", socket.id);

    // REGISTER USER
    socket.on("addUser", (userId) => {
      console.log("🟢 addUser:", userId);

      socket.userId = userId;

      // save socket
      userSockets.set(userId, socket.id);

      // send all online users
      io.emit("getOnlineUsers", Array.from(userSockets.keys()));

      console.log("ONLINE:", Array.from(userSockets.keys()));
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);

      if (socket.userId) {
        userSockets.delete(socket.userId);

        io.emit("getOnlineUsers", Array.from(userSockets.keys()));
      }
    });
    socket.on("markSeen", async ({ senderId, receiverId }) => {
      console.log("👁️ markSeen", senderId, receiverId);

      // update messages in DB
      await Message.updateMany(
        {
          senderId,
          receiverId,
          status: { $ne: "seen" },
        },
        {
          $set: { status: "seen" },
        },
      );

      // sender socket
      const senderSocketId = getReceiverSocketId(senderId.toString());

      // notify sender
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          senderId,
        });
      }
    });
  });

  return io;
};

// helper
export const getReceiverSocketId = (userId) => {
  return userSockets.get(userId);
};

export { io };
