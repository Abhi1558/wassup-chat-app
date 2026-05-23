import express from "express"
import {blockUser, unblockUser, updateEmail, changePassword, resetPassword, deleteAccount, updateProfile, check} from "../controllers/user.controller.js"
import {protectedRoute, upload} from "../middlewares/user.middleware.js"


const router = express.Router();

router.put("/block/:id", protectedRoute, blockUser)
router.put("/unblock/:id", protectedRoute, unblockUser)
router.put("/email", protectedRoute, updateEmail)
router.put("/change-password", protectedRoute, changePassword)
router.put("/reset-password", protectedRoute, resetPassword)
router.put("/update-profile", protectedRoute,upload.single("profilePic"), updateProfile)
router.delete("/delete-account", protectedRoute, deleteAccount )
router.get("/check",protectedRoute, check)

export default router;

