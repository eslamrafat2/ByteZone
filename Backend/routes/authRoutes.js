const express = require("express");

const router = express.Router();

const {
    register,
    login,
    refreshToken,
    logout
} = require("../controllers/authController");

const { protect } = require("../middelwares/auth.middleware");

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", protect, logout);

module.exports = router;