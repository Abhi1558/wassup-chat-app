import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import { io, getReceiverSocketId } from "../socket.js";
import { streamUpload } from "../lib/utills.js";
import { STATUS_CODES } from "../lib/constants.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;
    // Search users excluding current user
    if (!query || !query.trim()) {
      return res.json([]);
    }
    const cleanQuery = query.trim();

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { fullName: { $regex: cleanQuery, $options: "i" } },
        { email: { $regex: cleanQuery, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error searching users" });
  }
};
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
     // Fetch user's conversations
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageTime: -1 })
      .populate("participants", "fullName profilePic lastSeen _id description email ");
     // Format conversation data for sidebar
    const chats = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      return {
        conversationId: conv._id,
        user: otherUser || null,
        lastMessage: conv.lastMessage || "",
        lastMessageTime: conv.lastMessageTime || null,
        unreadCount: conv.unreadCount?.get(userId.toString()) || 0,
      };
    });

    res.status(STATUS_CODES.OK).json(chats);
  } catch (error) {
    console.log("getChats error:", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const userId = req.user._id;
    // Find conversation between users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, userToChatId] },
    });

    if (!conversation) {
      return res.status(STATUS_CODES.OK).json([]);
    }

    const limit = 20;
    const page = Number(req.query.page) || 1;
    // Load paginated messages
    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: -1 }) // get latest messages
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(STATUS_CODES.OK).json(messages.reverse()); // send oldest → newest
  } catch (error) {
    console.log("getMessages error:", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const text = req.body.text;
    const file = req.file;
    const senderId = req.user._id;
    const sender = req.user;

    

    const { id: receiverId } = req.params;

    const senderBlockedReceiver = sender.blockedUser.some(
      (id) => id.toString() === receiverId.toString()
    );
     // Validate sender and receiver permissions
    if (senderBlockedReceiver) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: "You have blocked this user",
      });
    }
    if (senderId.toString() === receiverId.toString()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Cannot message yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Receiver not found" });
    }
    const isBlocked = receiver.blockedUser.some(
      (id) => id.toString() === senderId.toString()
    );

    if (isBlocked) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: "You cannot send messages to this user",
      });
    }

    // Validation
    if (!text && !file) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Message cannot be empty" });
    }

    // Find or create conversation
    const participants = [senderId, receiverId]
      .map((id) => id.toString())
      .sort();

    let conversation = await Conversation.findOne({
      participants,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        unreadCount: new Map(),
        lastMessage: "",
        lastMessageTime: new Date(),
      });
    }
    // Upload media
    let imageUrl = null;

    try {
      if (file) {
        const upload = await streamUpload(file);
        imageUrl = upload.secure_url;
      }
    } catch (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR ).json({ message: "Image upload failed" });
    }

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      conversationId: conversation._id,
      type: file ? "image" : "text",
      text: text || "",
      image: imageUrl,
      status: "sent",
    });
    const receiverSocketId = getReceiverSocketId(receiverId.toString());

    if (receiverSocketId) {
      // send realtime message
      io.to(receiverSocketId).emit("newMessage", newMessage);

      // update status
      newMessage.status = "delivered";

      await newMessage.save();

      // sender socket
      const senderSocketId = getReceiverSocketId(senderId.toString());

      // notify sender
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          messageId: newMessage._id,
        });
      }
    }

    // Update conversation 
    const receiverKey = receiverId.toString();
    const senderKey = senderId.toString();
    if (!conversation.unreadCount) {
      conversation.unreadCount = new Map();
    }

    const currentUnread = conversation.unreadCount.get(receiverKey) || 0;

    conversation.unreadCount.set(receiverKey, currentUnread + 1);
    conversation.unreadCount.set(senderKey, 0);

    conversation.markModified("unreadCount");

    conversation.lastMessage = newMessage.text || (imageUrl ? "📷 Image" : "");

    conversation.lastMessageType = newMessage.type;
    conversation.lastMessageTime = new Date();

    await conversation.save();
    const updatedConversation = {
      conversationId: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageTime: conversation.lastMessageTime,
      unreadCount: conversation.unreadCount.get(receiverKey) || 0,
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
    };
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("conversationUpdated", updatedConversation);
    }

    // sender sidebar update
    const senderSocketId = getReceiverSocketId(senderId.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("conversationUpdated", {
        ...updatedConversation,
        unreadCount: 0,
      });
    }

    res.status(STATUS_CODES.CREATED).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("sendMessages error:", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};
