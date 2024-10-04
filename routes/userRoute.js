const express = require("express");
const router = express.Router();

// authentication middleware
const authMiddleware = require("../../db/middleware/authMiddleware");

// user controller's
const { register, login, checkUser } = require("../userController");

// register route
router.post("/register", register);

// login user
router.post("/login", login);

// check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;
