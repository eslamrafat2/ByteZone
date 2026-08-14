const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "Failed",
                message: "No Token Provided, Please Login First"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                status: "Failed",
                message: "User no longer exists"
            });
        }

        req.user = currentUser;

        next();

    } catch (error) {
        return res.status(401).json({
            status: "Failed",
            message: "Invalid or expired Token"
        });
    }
};

module.exports = {
    protect
};