import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";


export const generatetoken = (userId, res) => {
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




export const sendEmail = async (to, subject,html) => {
    try{
        const transport = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        }) 
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to, 
            subject,
            html

        }
        const info = await transport.sendMail(mailOptions)

        console.log("email send successfully")

    }catch(error){
        console.error("Email sending failed:", error.message);

    }
}

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







