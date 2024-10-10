const express = require("express");
const router = express.Router();

// authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// user controller's
const { register, login, checkUser,requestOTP,resetPassword } = require("../controller/userController");

// register route
router.post("/register", register);

// login user
router.post("/login", login);

// check user
router.get("/check", authMiddleware, checkUser);

// route to request an otp for password reset
router.post("/forgot-password",requestOTP);
// route to reset password using otp
router.post("/reset-password",resetPassword);

module.exports = router;
