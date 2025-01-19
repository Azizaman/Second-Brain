// import express from "express";
// import mongoose from "mongoose";
// import multer from "multer";
// import pkg from "pdfjs-dist";
// const { getDocument } = pkg;
// import Tesseract from "tesseract.js";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser"; // New import for cookie handling
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import notesRoutes from "./routes/notes.js";
// import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";
// dotenv.config();
// // Constants
// const PORT = 5000;
// const MONGO_URI = process.env.MONGO_URL;
// const AI_API_KEY = process.env.AI_API_KEY;
// const JWT_SECRET = process.env.JWT_SECRET;
// // AI Model Initialization
// const AI_MODEL_INSTANCE = new GoogleGenerativeAI(AI_API_KEY).getGenerativeModel({
//   model: "gemini-pro",
// });
// // Initialize Express
// const app = express();
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cookieParser()); // Enable cookie parsing
// app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow cookies to be sent
// // MongoDB connection
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));
// // MongoDB Schema
// const FileSchema = new mongoose.Schema({
//   userid: String,
//   title: String,
//   fileKey: String,
//   data: Buffer,
//   extractedText: String,
//   parsedResponse: Object,
// });
// declare global {
//   namespace Express {
//     interface Request {
//       user?: { sub: string; email?: string; name?: string };
//     }
//   }
// }
// const FileModel = mongoose.model("File", FileSchema);
// // Multer Configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// // Middleware to Authenticate Requests (Updated to read from cookies)
// const verifyAuthToken =async (req, res, next) => {
//   const token = req.cookies.auth0; // Get token from cookies
//   const authorization=req.header.Authorization;
//   const userid=authorization?.split('Bearer ')[1];
//   if (!userid) return res.status(401).json({ error: "Unauthorized: No userid provided" });
//   try {
//     const decoded = jwt.verify(userid, JWT_SECRET);
//     req.user = decoded;
//     res.set('userid',userid);
//     await next();
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     res.status(403).json({ error: "Forbidden: Invalid token" });
//   }
// };
// // Text Extraction from PDF
// const extractTextFromPDF = async (fileBuffer) => {
//   try {
//     const pdf = await getDocument({ data: new Uint8Array(fileBuffer) }).promise;
//     let text = "";
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       text += content.items
//         .map((item) => ("str" in item ? item.str : ""))
//         .join(" ") + "\n";
//     }
//     return text.trim();
//   } catch (error) {
//     console.error("Error extracting text from PDF:", error);
//     return "";
//   }
// };
// // OCR Text Extraction for Images
// const extractTextUsingOCR = async (fileBuffer) => {
//   const result = await Tesseract.recognize(fileBuffer, "eng", {
//     logger: (m) => console.log(m),
//   });
//   return result.data.text.trim();
// };
// // Clean Extracted Text
// const cleanExtractedText = (text) => text.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ").trim();
// // Analyze Text with AI
// const analyzeContractWithAI = async (contractText) => {
//   const prompt = 
//     Analyze the following document and provide a brief summary in 2 lines.
//     Provide the response in JSON format with the following key:
//     - summary: the document summary.
//     Document text:
//     ${contractText.substring(0, 2000)}
//   ;
//   try {
//     const results = await AI_MODEL_INSTANCE.generateContent(prompt);
//     const responseText = results.response.text().trim().replace(/
// json|
// /g, "");
//     return JSON.parse(responseText);
//   } catch (error) {
//     console.error("Error analyzing contract with AI:", error);
//     throw new Error("Failed to analyze contract");
//   }
// };
// // Protect dashboard route
// app.get("/dashboard", ensureAuthenticated, (req, res) => {
//   res.send(<h1>Dashboard</h1><p>Hello, ${req.user.name}</p>);
// });
// // Middleware to protect routes
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/");
// }
// // Google login route
// app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// // Callback route
// app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", { failureRedirect: "/" }),
//     (req, res) => {
//       res.redirect("/dashboard");
//     }
// );
// // Logout route
// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });
// // Start server
// // File Upload Endpoint
// app.post("/upload", [verifyAuthToken, upload.single("file")], async (req, res) => {
//   try {
//     const { title } = req.body;
//     const { user } = req;
//     const userid = user?.sub;
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//     if (!userid) return res.status(400).json({ error: "Invalid user ID" });
//     const fileKey = req.file.originalname;
//     const fileBuffer = req.file.buffer;
//     // Extract text from file
//     let extractedText = fileKey.endsWith(".pdf")
//       ? await extractTextFromPDF(fileBuffer)
//       : await extractTextUsingOCR(fileBuffer);
//     extractedText = cleanExtractedText(extractedText);
//     if (!extractedText) return res.status(400).json({ error: "Failed to extract text." });
//     // Analyze the extracted text
//     const analysis = await analyzeContractWithAI(extractedText);
//     // Save file and analysis in DB
//     await FileModel.deleteOne({ fileKey, userid });
//     const newFile = new FileModel({
//       userid,
//       title,
//       fileKey,
//       data: fileBuffer,
//       extractedText,
//       parsedResponse: analysis,
//     });
//     await newFile.save();
//     res.status(200).json({
//       message: "File uploaded and analyzed successfully",
//       summary: analysis.summary,
//     });
//   } catch (error) {
//     console.error("Error uploading and processing file:", error);
//     res.status(500).json({ error: "Failed to upload and process file." });
//   }
// });
// // Fetch Documents
// app.get("/documents", verifyAuthToken, async (req, res) => {
//   try {
//     const userid = req.user?.sub;
//     if (!userid) return res.status(404).json({ error: "User ID not found" });
//     const documents = await FileModel.find({ userid });
//     res.json(documents);
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     res.status(500).json({ error: "Failed to fetch documents." });
//   }
// });
// // Fetch Specific Document
// app.get("/documents/:id", verifyAuthToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userid = req.user?.sub;
//     const document = await FileModel.findOne({ _id: id, userid });
//     if (!document) return res.status(404).send("Document not found");
//     res.set("Content-Type", "application/pdf");
//     res.send(document.data);
//   } catch (error) {
//     console.error("Error fetching document:", error);
//     res.status(500).send("Error fetching document");
//   }
// });
// // Start Server
// app.listen(PORT, () => console.log(Server running on http://localhost:${PORT}));
