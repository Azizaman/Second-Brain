import express from 'express';
import { Router } from 'express';
const router=Router();
import mongoose from "mongoose";

const DiaryEntrySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const DiaryEntry = mongoose.model("DiaryEntry", DiaryEntrySchema);



router.post("/", async (req, res) => {
    try {
      const { userId, title, content, tags, mood } = req.body;
  
      const newEntry = new DiaryEntry({
        userId,
        title,
        content,
        tags,
        mood,
      });
  
      await newEntry.save();
      res.status(201).json({
        message:'Diary created successfully',newEntry
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create diary entry." });
    }
  });

  



  router.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const entries = await DiaryEntry.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch diary entries." });
    }
  });


  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedEntry = await DiaryEntry.findByIdAndUpdate(
        id,
        { ...updatedData, updatedAt: Date.now() },
        { new: true }
      );
  
      if (!updatedEntry) {
        return res.status(404).json({ error: "Entry not found." });
      }
  
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update diary entry." });
    }
  });
  
  
  
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEntry = await DiaryEntry.findByIdAndDelete(id);
  
      if (!deletedEntry) {
        return res.status(404).json({ error: "Entry not found." });
      }
  
      res.status(200).json({ message: "Diary entry deleted." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete diary entry." });
    }
  });
  
  export default router;
