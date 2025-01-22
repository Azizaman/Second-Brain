var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
const router = Router();
import mongoose from "mongoose";
const DiaryEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    mood: {
        type: String,
        enum: ["happy", "sad", "neutral", "excited", "angry"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
}, { timestamps: true });
const DiaryEntry = mongoose.model("DiaryEntry", DiaryEntrySchema);
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, content, tags, mood } = req.body;
        const newEntry = new DiaryEntry({
            userId,
            title,
            content,
            tags,
            mood,
        });
        yield newEntry.save();
        res.status(201).json({
            message: 'Diary created successfully', newEntry
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create diary entry." });
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const entries = yield DiaryEntry.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(entries);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch diary entries." });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedEntry = yield DiaryEntry.findByIdAndUpdate(id, Object.assign(Object.assign({}, updatedData), { updatedAt: Date.now() }), { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ error: "Entry not found." });
        }
        res.status(200).json(updatedEntry);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update diary entry." });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedEntry = yield DiaryEntry.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ error: "Entry not found." });
        }
        res.status(200).json({ message: "Diary entry deleted." });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete diary entry." });
    }
}));
export default router;
