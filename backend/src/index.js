import express from "express";
import dotenv from "dotenv";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/DB.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

// Environment Validation
const requiredEnv = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/message", messageRoutes);

// Socket Initialization
initSocket(server);

// Database + Server Startup
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });