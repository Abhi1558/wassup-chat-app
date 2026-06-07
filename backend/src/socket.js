import { Server } from "socket.io";
import Message from "./models/message.model.js";
import User from "./models/user.model.js";

let io;

// userId -> socketId
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
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
    socket.on("disconnect", async () => {
      console.log("❌ Disconnected:", socket.id);

      if (socket.userId) {
        // remove from online users
        userSockets.delete(socket.userId);

        // update last seen
        await User.findByIdAndUpdate(socket.userId, {
          lastSeen: new Date(),
        });

        // send updated online users
        io.emit("getOnlineUsers", Array.from(userSockets.keys()));
      }
    });
    socket.on("markSeen", async ({ senderId, receiverId }) => {
      console.log("👁️ markSeen", senderId, receiverId);

      // get unseen messages first
      const unseenMessages = await Message.find({
        senderId,
        receiverId,
        status: { $ne: "seen" },
      });

      // update DB
      await Message.updateMany(
        {
          senderId,
          receiverId,
          status: { $ne: "seen" },
        },
        {
          $set: { status: "seen" },
        }
      );
      

      // sender socket
      const senderSocketId = getReceiverSocketId(senderId.toString());

      // notify sender message-by-message
      if (senderSocketId) {
        unseenMessages.forEach((msg) => {
          io.to(senderSocketId).emit("messageSeen", {
            messageId: msg._id,
          });
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
