import Temp from "../models/temp.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import { sendEmail } from "../lib/utills.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const toggleBlockUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { id: targetUserId } = req.params;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "Target user not found",
      });
    }

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyBlocked = user.blockedUser.some(
      (id) => id.toString() === targetUserId
    );

    if (alreadyBlocked) {
      await User.findByIdAndUpdate(currentUserId, {
        $pull: {
          blockedUser: targetUserId,
        },
      });

      return res.status(200).json({
        blocked: false,
        message: "User unblocked successfully",
      });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: {
        blockedUser: targetUserId,
      },
    });

    return res.status(200).json({
      blocked: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    console.log("toggleBlockUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    // 1. Validate input
    if (!cleanEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2. Get user first (IMPORTANT FIX)
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldEmail = user.email;

    // 3. Check if same email
    if (oldEmail === cleanEmail) {
      return res.status(400).json({
        message: "New email must be different from current email",
      });
    }

    // 4. Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 5. Check if email already exists
    const existing = await User.findOne({
      email: cleanEmail,
      _id: { $ne: userId },
    });
    if (existing) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // 6. Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // 7. Store temp verification request
    await Temp.findOneAndUpdate(
      { email: oldEmail, purpose: "email-verification" },
      {
        $set: {
          token,
          newEmail: cleanEmail,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { upsert: true, new: true }
    );

    // 8. Create verification link
    const verificationLink = `${process.env.CLIENT_URL}/verification/email-verification/${token}`;

    // 9. Send email
    await sendEmail(
      cleanEmail,
      "Email Change Verification",
      `
        <p>You requested to change your email.</p>
        <p>This link will expire in 5 minutes.</p>
        <p>If the button doesn't work, use this link:</p>
        <p>${verificationLink}</p>
      `
    );

    // 10. Response
    return res.status(200).json({
      message: "Email verification link sent successfully",
    });
  } catch (error) {
    console.log("error in updateEmail controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userid = req.user._id;
  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different",
      });
    }
    const user = await User.findById(userid).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be atleast 8 characters long" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "new password and confirm password are not matched" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    console.log("error in change password controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { fullName, description } = req.body;

  try {
    let updateData = {};

    if (fullName !== undefined && fullName.trim().length === 0) {
      return res.status(400).json({ message: "Full name can't be empty" });
    }
    if (fullName) updateData.fullName = fullName;

    
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        message: "Only image files allowed",
      });
    }
    if (req.file) {
      let uploadImage;
      try {
        uploadImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profiles" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          stream.end(req.file.buffer);
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }

      updateData.profilePic = uploadImage.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("error in update profile pic controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const conversations = await Conversation.find({
      participants: user._id,
    }).select("_id");

    const conversationIds = conversations.map((c) => c._id);

    await Message.deleteMany({
      conversationId: { $in: conversationIds },
    });

    await Conversation.deleteMany({
      participants: user._id,
    });

    await User.findByIdAndDelete(user._id);
    await User.updateMany(
      {},
      {
        $pull: {
          blockedUser: user._id,
        },
      }
    );

    res.clearCookie("jwt");
    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("deleteAccount error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
