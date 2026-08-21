const express = require("express");
const router = express.Router();

const { protect } = require("../middelwares/auth.middleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const safeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        status: "success",
        user: safeUser(req.user)
    });
});

router.put("/profile", protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        if (typeof name !== "string" || !name.trim() || name.trim().length < 2) {
            return res.status(400).json({
                status: "failed",
                message: "Name must be at least 2 characters long."
            });
        }

        const trimmedName = name.trim();
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                status: "failed",
                message: "Please enter a valid email address."
            });
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "role") || Object.prototype.hasOwnProperty.call(req.body, "password") || Object.prototype.hasOwnProperty.call(req.body, "refreshToken")) {
            return res.status(400).json({
                status: "failed",
                message: "Role, password, and token fields cannot be changed here."
            });
        }

        const duplicateUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user._id }
        });

        if (duplicateUser) {
            return res.status(409).json({
                status: "failed",
                message: "This email is already in use by another account."
            });
        }

        req.user.name = trimmedName;
        req.user.email = normalizedEmail;

        await req.user.save();

        res.status(200).json({
            status: "success",
            user: safeUser(req.user)
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message || "Unable to update your profile."
        });
    }
});

router.put("/password", protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ status: "failed", message: "Current and new passwords are required." });
        }

        if (typeof newPassword !== "string" || newPassword.length < 6) {
            return res.status(400).json({ status: "failed", message: "New password must be at least 6 characters." });
        }

        const matches = await bcrypt.compare(currentPassword, req.user.password);
        if (!matches) {
            return res.status(401).json({ status: "failed", message: "Current password is incorrect." });
        }

        req.user.password = await bcrypt.hash(newPassword, 10);
        req.user.refreshToken = undefined;
        await req.user.save();
        res.clearCookie("refreshToken");

        return res.status(200).json({ status: "success", message: "Password changed successfully. Please log in again." });
    } catch (error) {
        return res.status(500).json({ status: "failed", message: error.message || "Unable to change password." });
    }
});

module.exports = router;