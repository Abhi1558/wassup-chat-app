import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true },
);

// 🔥 performance indexes
messageSchema.index({ conversationId: 1 });
messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
