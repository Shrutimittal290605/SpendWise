import express from "express";

import {
    loginControllers,
    registerControllers,
    setAvatarController,
    changePasswordController
} from "../controllers/userController.js";

const router = express.Router();


// Register
router.route("/register").post(registerControllers);


// Login
router.route("/login").post(loginControllers);


// Set Avatar
router.route("/setAvatar/:id").post(setAvatarController);


// Change Password
router.route("/change-password").put(changePasswordController);


export default router;