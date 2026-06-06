import rateLimit from "express-rate-limit";
import {STATUS_CODES} from "../lib/constants.js"
// LOGIN LIMITER
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  statusCode: STATUS_CODES.TOO_MANY_REQUESTS,

  message: {
    success: false,
    message:
      "Too many login attempts. Try again in 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
// SIGNUP LIMITER
export const signupLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 5,

  message: {
    success: false,
    message:
      "Too many signup attempts. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// FORGOT PASSWORD LIMITER
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 3,

  message: {
    success: false,
    message:
      "Too many password reset requests. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});