import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production"
    || process.env.COOKIE_SECURE === "true"
    || process.env.CLIENT_URL?.startsWith("https://");

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const createToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: "name, username and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ error: "Username is already taken" });
        }

        const user = new User({ name, username, password });
        await user.save();

        const token = createToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(201).json({
            user: { id: user._id, name: user.name, username: user.username },
            message: "User registered successfully"
        });
    } catch (err) {
        console.log("Register error:", err);
        return res.status(500).json({ error: "Failed to register user" });
    }
});

// Log in an existing user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = createToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.json({
            user: { id: user._id, name: user.name, username: user.username },
            message: "Logged in successfully"
        });
    } catch (err) {
        console.log("Login error:", err);
        return res.status(500).json({ error: "Failed to log in" });
    }
});

// Log out — clear the auth cookie
router.post("/logout", (req, res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.json({ success: "Logged out" });
});

// Return the currently logged-in user (used on app load to restore session)
router.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ user: { id: user._id, name: user.name, username: user.username }, message: "User fetched successfully" });
    } catch (err) {
        console.log("Me error:", err);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;
