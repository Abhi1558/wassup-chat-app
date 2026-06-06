import express from "express"
import {verifySignupEmail, forgotPasswordVerification, emailChangeVerification} from "../controllers/verification.controller.js"


const router = express.Router();


router.get("/signUp-verification/:token", verifySignupEmail);
router.put("/password-verification/:token",forgotPasswordVerification)
router.get("/email-verification/:token", emailChangeVerification);
export default router