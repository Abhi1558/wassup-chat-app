import express from "express"
import {signUp, logIn, logOut, forgotPassword} from "../controllers/auth.controller.js"
import {protectedRoute} from "../middlewares/user.middleware.js"
const router=express.Router();//create a small app 

router.post("/signup",signUp)
router.post("/login",logIn)
router.post("/logout",protectedRoute, logOut)
router.put("/forgot-password", protectedRoute, forgotPassword)


export default router;