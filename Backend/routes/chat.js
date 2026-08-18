import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/openai.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// Every route below requires a logged-in user, and every query is scoped
// to req.userId so one user can never see or touch another user's threads.
router.use(requireAuth);

// Get all threads belonging to the logged-in user
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ user_id: req.userId }).sort({ updatedAt: -1 });
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId, user_id: req.userId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, user_id: req.userId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "missing required fields"
        });
    }

    try {
        // Scoped to user_id so a thread ID can never be "taken over" by
        // posting to it while logged in as a different user.
        let thread = await Thread.findOne({ threadId, user_id: req.userId });

        if (!thread) {
            thread = new Thread({
                threadId,
                user_id: req.userId,
                title: message,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });
        } else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        const assistantReply = await getGeminiAPIResponse(
            thread.messages
        );

        if (!assistantReply) {
            return res.status(500).json({
                error: "Gemini did not return a response"
            });
        }

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        return res.json({
            reply: assistantReply
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "something went wrong"
        });
    }
});

export default router;
