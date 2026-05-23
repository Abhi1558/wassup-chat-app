import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: [
        (arr) => arr.length === 2,
        "Conversation must have exactly 2 participants",
      ],
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    lastMessageTime: {
      type: Date,
      default: Date.now,
    },

    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },
  },
  { timestamps: true }
);

// 🔥 performance boost
conversationSchema.index({ participants: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;