const express = require("express");
const router = express.Router();

const { protect } = require("../middelwares/auth.middleware");

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user
    });
});

module.exports = router;