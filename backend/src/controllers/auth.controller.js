import User from "../models/user.model.js";
import Temp from "../models/temp.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generatetoken, sendEmail } from "../lib/utills.js";
import { STATUS_CODES } from "../lib/constants.js";

export const signUp = async (req, res) => {
 
  const { fullName, email, password } = req.body;
  try {
  
    if (!fullName || !email || !password) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email: cleanEmail });

    if (user)
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(32).toString("hex");

    const verifyLink = `${process.env.CLIENT_URL}/verification/signUp-verification/${token}`;

    const tempUser = await Temp.findOneAndUpdate(
      { email: cleanEmail, purpose: "signup" },
      {
        $set: {
          fullName: cleanName,
          password: hashedPassword,
          token,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { upsert: true, new: true },
    );

    await sendEmail(
      cleanEmail,
      "Verify your email",
      `
        <h2>Email Verification</h2>
        <p>You have 5 minutes to verify your account.</p>
        <a href="${verifyLink}" 
           style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none;">
           Verify Email
        </a>
        <p>If button doesn't work, use this link:</p>
        <p>${verifyLink}</p>
      `,
    );

    res.status(STATUS_CODES.OK).json({
      message: "Verification email sent. Please verify within 5 minutes",
    });
  } catch (error) {
    console.log(`error in signup controller ${error.message}`);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
export const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Email and password required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "invalid credentials" });
    }
    generatetoken(user._id, res);
    res.status(STATUS_CODES.OK).json({
      message: "Login successfully",
      data: {
        _id: user._id,
        fullname: user.fullName,
        email: user.email,
        profilepic: user.profilePic,
      },
      
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({message: "internal server error" });
  }
};
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(STATUS_CODES.OK).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await Temp.findOneAndUpdate(
      { email: cleanEmail, purpose: "reset-password" },
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
      cleanEmail,
      "Reset password link",
      `
        <p>this is your link for changing password.it will be expired in 5 minutes.</p>
        <p>If button doesn't work, use this link:</p>
        <p>${verifylink}</p>
      `,
    );
    return res
      .status(STATUS_CODES.OK)
      .json({ message: "password reset link sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
