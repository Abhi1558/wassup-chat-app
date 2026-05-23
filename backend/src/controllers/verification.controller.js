import User from "../models/user.model.js";
import Temp from "../models/temp.model.js";
import { sendEmail } from "../lib/utills.js";
import { generatetoken } from "../lib/utills.js";
import bcrypt from "bcryptjs";

export const verifySignupEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const tempUser = await Temp.findOne({
      token: token,
    });

    if (!tempUser) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    if (tempUser.expiresAt < Date.now()) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(400).json({
        message: "Verification link expired. Please signup again.",
      });
    }

    const purpose = tempUser.purpose;
    if (purpose !== "signup") {
      return res.status(400).json({ message: "token purpose is not defined" });
    }

    const newUser = await User.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      password: tempUser.password,
    });
    const email = newUser.email;
    const name = newUser.fullName;

    await Temp.deleteOne({ _id: tempUser._id });

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
        
        
      `,
    );

    generatetoken(newUser._id, res);

    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("verify email error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const resetPasswordVerification = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const tempUser = await Temp.findOne({ token });

    if (!tempUser) {
      return res.status(400).json({ message: "token unavailable" });
    }

    if (tempUser.expiresAt < Date.now()) {
      await Temp.deleteOne({ _id: tempUser._id });

      return res.status(400).json({
        message: "Verification link expired. Please signup again.",
      });
    }

    const purpose = tempUser.purpose;
    if (purpose !== "reset-password") {
      return res.status(400).json({ message: "token purpose is not defined" });
    }
    const user = await User.findOne({ email: tempUser.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate(
      { email: tempUser.email },
      {
        $set: { password: hashedPassword },
      },
    );
    await Temp.deleteOne({ _id: tempUser._id });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict",
    });
    return res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    console.log("rest password verification error :", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const emailVerification = async (req, res) => {
  const { token } = req.params;
  try {
    const tempUser = await Temp.findOne({ token });
    if (!tempUser) {
      return res.status(400).json({ message: "token unavailable" });
    }
    if (tempUser.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const purpose = tempUser.purpose;
    if (purpose !== "email-verification") {
      return res.status(400).json({ message: "token purpose is not defined" });
    }
    const newEmail = tempUser.newEmail;
    const oldEmail = tempUser.email;

    const user = await User.findOne({ email: oldEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.email = newEmail;
    await user.save();
    await Temp.deleteOne({ _id: tempUser._id });

    await sendEmail(
      newEmail,
      "Email changed successfully",
      `
            <p>from now this is your new registred email.</p>
            
          `,
    );

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict",
    });

    return res.status(200).json({ message: "email changed successfully" });
  } catch (error) {
    console.log("email verification error :", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
