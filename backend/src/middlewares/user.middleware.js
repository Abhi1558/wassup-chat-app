import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { STATUS_CODES } from "../lib/constants.js";
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token || typeof token !== "string") {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Unauthorized Token",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});
