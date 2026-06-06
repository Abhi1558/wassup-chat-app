import express from "express"
import {toggleBlockUser, changeEmail, changePassword, deleteAccount, updateProfile, check} from "../controllers/user.controller.js"
import {protectedRoute, upload} from "../middlewares/user.middleware.js"


const router = express.Router();

router.patch("/block/:id", protectedRoute, toggleBlockUser)
router.put("/change-email", protectedRoute, changeEmail)
router.put("/change-password", protectedRoute, changePassword)
router.put("/update-profile", protectedRoute,upload.single("profilePic"), updateProfile)
router.delete("/delete-account", protectedRoute, deleteAccount )
router.get("/check",protectedRoute, check)

export default router;

