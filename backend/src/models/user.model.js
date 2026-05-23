import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    email: {
      unique: true,
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      select: false,
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    blockedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastSeen: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userschema);
export default User;
