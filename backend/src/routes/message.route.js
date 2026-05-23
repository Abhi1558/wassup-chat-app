import express from "express"
import { protectedRoute, upload } from "../middlewares/user.middleware.js"
import {getChats, getMessages, sendMessages, searchUsers} from "../controllers/message.controller.js"

const router = express.Router();
router.get("/search",protectedRoute, searchUsers)
router.get("/get-chats", protectedRoute, getChats)
router.get("/get-message/:id", protectedRoute, getMessages)
router.post("/send-message/:id", protectedRoute,upload.single("image"), sendMessages)

export default router