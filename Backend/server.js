import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

// credentials: true is required so the browser will send/receive the
// httpOnly auth cookie; origin must be an explicit URL (not "*") for that.
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173" ,
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};
