import Temp from "../models/temp.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const blockedUserId = req.params.id;
    if (userId.toString() === blockedUserId.toString()) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }

    const findBlockUser = await User.findById(blockedUserId);
    if (!findBlockUser) {
      return res.status(400).json({ message: "User not found" });
    }
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          blockedUser: blockedUserId,
        },
      },
      { new: true },
    );
    res.status(200).json({
      message: "User blocked successfully",
    });
  } catch (error) {
    console.log("Error in blockUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const blockedUserId = req.params.id;

    if (userId.toString() === blockedUserId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { blockedUser: blockedUserId },
      },
      { new: true },
    );

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error in unblockUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, password } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findById(userId);
    const oldEmail = user.email;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (oldEmail === cleanEmail) {
      return res
        .status(400)
        .json({ message: "New email must be different from current email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await Temp.findOneAndUpdate(
      { email: oldEmail, purpose: "email-verification" },
      {
        $set: {
          token,
          newEmail: cleanEmail,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { upsert: true, new: true },
    );

    const verifylink = `${process.env.CLIENT_URL}/api/verification/password-verification/${token}`;
    await sendEmail(
      email,
      "Reset password link",
      `
            <p>this is your link for changing password.it will be expired in 5 minutes.</p>
            <p>If button doesn't work, use this link:</p>
            <p>${verifylink}</p>
          `,
    );
    return res
      .status(200)
      .json({ message: "password reset link sent to email" });
  } catch (error) {
    console.log("error in updateemail controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userid = req.user._id;
  try {
    const user = await User.findById(userid);

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be atleast 6 characters long" });
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

export const resetPassword = async (req, res) => {
  const userid = req.user._id;

  try {
    const user = await User.findById(userid);
    const email = user.email;

    const token = crypto.randomBytes(32).toString("hex");

    await Temp.findOneAndUpdate(
      { email: email, purpose: "reset-password" },
      {
        $set: {
          token,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { upsert: true, new: true },
    );
    const verifylink = `${process.env.CLIENT_URL}/api/verification/password-verification/${token}`;
    await sendEmail(
      email,
      "Reset password link",
      `
            <p>this is your link for changing password.it will be expired in 5 minutes.</p>
            <p>If button doesn't work, use this link:</p>
            <p>${verifylink}</p>
          `,
    );
    return res
      .status(200)
      .json({ message: "password reset link sent to email" });
  } catch (error) {
    console.log("error in reset password controller:", error.message);
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

    if (description !== undefined && description.trim().length === 0) {
      return res.status(400).json({ message: "Description can't be empty" });
    }
    if (description !== undefined) updateData.description = description;
    if (req.file) {
      let uploadImage;
      try {
        uploadImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profiles" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
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
      { new: true },
    );
    console.log(`Profile updated for user: ${userId}`);
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
    const userId = req.user._id;
    const { password } = req.body;

    const user = await User.findById(userId);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    await User.findOneAndDelete(userId);

    res.clearCookie("jwt");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(`error in deleteAccount controller : ${error}`);
    res.status(500).json({ message: "Internal server error " });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
