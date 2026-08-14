const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateAccessToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        }
    );
};

const generateRefreshToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    );
};

const sendRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password"
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: "success",
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email });

        if (
            !user ||
            !(await bcrypt.compare(password, user.password))
        ) {
            return res.status(401).json({
                message: "Incorrect email or password"
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        sendRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            status: "success",
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.status(200).json({
            status: "success",
            token: newAccessToken
        });

    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};

const logout = async (req, res) => {
    try {
        req.user.refreshToken = undefined;

        await req.user.save();

        res.clearCookie("refreshToken");

        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};