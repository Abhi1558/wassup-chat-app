import express from "express";

import {
  signUp,
  logIn,
  logOut,
  forgotPassword,
} from "../controllers/auth.controller.js";

import { protectedRoute }from "../middlewares/user.middleware.js";

import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/signup",
  signupLimiter,
  signUp
);

router.post(
  "/login",
  loginLimiter,
  logIn
);

router.post(
  "/logout",
  protectedRoute,
  logOut
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPassword
);

export default router;