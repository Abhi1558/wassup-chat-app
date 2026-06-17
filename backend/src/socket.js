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
    console.log("Socket Connected:", socket.id);

    // REGISTER USER
    socket.on("addUser", (userId) => {
      console.log("ADD USER:", userId, socket.id);

      socket.userId = userId;

      // Save latest socket for user
      userSockets.set(userId, socket.id);

      console.log("ONLINE USERS:", [...userSockets.entries()]);

      // Broadcast online users
      io.emit("getOnlineUsers", Array.from(userSockets.keys()));
    });

    // MARK SEEN
    socket.on("markSeen", async ({ senderId, receiverId }) => {
      try {
        const unseenMessages = await Message.find({
          senderId,
          receiverId,
          status: { $ne: "seen" },
        });

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
       
        const senderSocketId = getReceiverSocketId(
          senderId.toString()
        );

        if (senderSocketId) {
          unseenMessages.forEach((msg) => {
            io.to(senderSocketId).emit("messageSeen", {
              messageId: msg._id,
            });
          });
        }
        
      } catch (error) {
        console.error("markSeen error:", error);
      }
    });

    // DISCONNECT
    socket.on("disconnect", async (reason) => {
      console.log(
        "DISCONNECTED:",
        socket.userId,
        socket.id,
        reason
      );

      if (!socket.userId) return;

      const currentSocketId = userSockets.get(socket.userId);

      // Ignore stale disconnects
      if (currentSocketId !== socket.id) {
        console.log(
          "Ignoring stale socket disconnect:",
          socket.id
        );
        return;
      }

      userSockets.delete(socket.userId);

      try {
        await User.findByIdAndUpdate(socket.userId, {
          lastSeen: new Date(),
        });
      } catch (error) {
        console.error("Last seen update error:", error);
      }

      io.emit("getOnlineUsers", Array.from(userSockets.keys()));

      console.log(
        "ONLINE USERS AFTER DISCONNECT:",
        [...userSockets.entries()]
      );
    });
  });

  return io;
};

// helper
export const getReceiverSocketId = (userId) => {
  return userSockets.get(userId);
};

export { io };
