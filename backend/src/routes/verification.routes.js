import express from "express"
import {verifySignupEmail, resetPasswordVerification, emailVerification} from "../controllers/verification.controller.js"


const router = express.Router();


router.get("/signUp-verification/:token", verifySignupEmail);
router.put("/password-verification/:token",resetPasswordVerification)
router.get("/email-verification/:token", emailVerification);

export default router