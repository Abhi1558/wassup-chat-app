import jwt from "jsonwebtoken"
import axios from "axios";
import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";


export const generateToken = (userId, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax", 
      secure: process.env.NODE_ENV != "development", 
    });

    return token;

  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw error;
  }
};



export const sendEmail = async (to, subject, html) => {
  try {
    
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Wassup Chat",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    
  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response?.data || error.message
    );
  }
};
export const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "chat-app" }, // optional
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};







