import User from "../models/user.model.js";
import Temp from "../models/temp.model.js";
import { sendEmail } from "../lib/utills.js";
import { generateToken } from "../lib/utills.js";
import bcrypt from "bcryptjs";
import { STATUS_CODES } from "../lib/constants.js";
export const verifySignupEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // Validate verification token
    const tempUser = await Temp.findOne({
      token: token,
    });

    if (!tempUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid or expired verification link",
      });
    }

    if (tempUser.expiresAt < Date.now()) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Verification link expired. Please signup again.",
      });
    }
    // Verify token purpose and account availability
    const purpose = tempUser.purpose;
    if (purpose !== "signup") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "token purpose is not defined",
      });
    }

    const existingUser = await User.findOne({
      email: tempUser.email,
    });

    if (existingUser) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Email already registered",
      });
    }
    // Create verified user account
    const newUser = await User.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      password: tempUser.password,
    });

    const email = newUser.email;
    const name = newUser.fullName;
    // Send welcome email and login user
    await sendEmail(
      email,
      "Welcome Message",
      `
        <h2>Welcome to wassup</h2>
        <p>
        hi${name},<br><br>
        We’re excited to have you on board! Your account has been successfully verified, and you’re now part of the Wassup community.You can now connect with friends, send messages, and enjoy real-time conversations seamlessly.
        Happy chatting! 😊 
        </p>
        
        
      `
    );
    await Temp.deleteOne({ _id: tempUser._id });

    generateToken(newUser._id, res);

    return res.status(STATUS_CODES.OK).json({
      message: "Email verified successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("verify email error:", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const forgotPasswordVerification = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  try {
    // Validate new password
    if (!newPassword || !confirmPassword) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Password must be at least 8 characters",
      });
    }
    // Validate reset token
    const tempUser = await Temp.findOne({ token });

    if (!tempUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "token unavailable",
      });
    }

    if (tempUser.expiresAt < Date.now()) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Verification link expired. Please reset your password again.",
      });
    }
    const purpose = tempUser.purpose;
    if (purpose !== "reset-password") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "token purpose is not defined",
      });
    }
    // Verify account associated with token
    const user = await User.findOne({ email: tempUser.email });

    if (!user) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid or expired token",
      });
    }

    // Update password and clear temporary token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { email: tempUser.email },
      {
        $set: { password: hashedPassword },
      }
    );
    await Temp.deleteOne({ _id: tempUser._id });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict",
    });
    return res.status(STATUS_CODES.OK).json({
      message: "password changed successfully",
    });
  } catch (error) {
    console.log("rest password verification error :", error.message);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const emailChangeVerification = async (req, res) => {
  const { token } = req.params;
  try {
    // Validate email verification token
    const tempUser = await Temp.findOne({ token });
    if (!tempUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "token unavailable",
      });
    }
    if (tempUser.expiresAt < Date.now()) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Token expired",
      });
    }
    // Verify token purpose and user account
    const purpose = tempUser.purpose;
    if (purpose !== "email-verification") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "token purpose is not defined",
      });
    }
    const newEmail = tempUser.newEmail;
    const oldEmail = tempUser.email;

    const user = await User.findOne({ email: oldEmail });

    if (!user) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "User not found",
      });
    }
    // Verify token purpose and user account
    const existingUser = await User.findOne({
      email: newEmail,
    });

    if (existingUser) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Email already in use",
      });
    }
    // Update email and notify user
    user.email = newEmail;
    await user.save();

    await sendEmail(
      newEmail,
      "Email changed successfully",
      `
            <p>from now this is your new registred email.</p>
            
          `
    );
    // Clear verification request and logout user
    await Temp.deleteOne({ _id: tempUser._id });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict",
    });

    return res.status(STATUS_CODES.OK).json({
      message: "email changed successfully",
    });
  } catch (error) {
    console.log("email verification error :", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
