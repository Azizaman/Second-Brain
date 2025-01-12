import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import pkg from 'pdfjs-dist';
const { getDocument } = pkg;
import Tesseract from "tesseract.js"; // For OCR on images
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { addNote, getNotes } from "./controllers/notesupload.js";


dotenv.config();

// Constants
const PORT = 5000;
const MONGO_URI = 'process.env.MONGO_URI';
const AI_MODEL = "gemini-pro"; // Assuming AI analysis uses this
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL_INSTANCE = new GoogleGenerativeAI(AI_API_KEY).getGenerativeModel({ model: AI_MODEL });

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend URL
}));

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema for Files
const FileSchema = new mongoose.Schema({
  fileKey: String,
  data: Buffer,
  extractedText: String, 
  parsedResponse: Object, // Store AI-generated summary
   // Store extracted text for analysis
});
const FileModel = mongoose.model("File", FileSchema);

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to extract text from PDF
const extractTextFromPDF = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const pdf = await getDocument({ data: new Uint8Array(fileBuffer) }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text.trim(); // Ensure no leading/trailing whitespace
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return ""; // Return empty string on failure
  }
};


// Function to extract text using OCR
const extractTextUsingOCR = async (fileBuffer: Buffer): Promise<string> => {
  const result = await Tesseract.recognize(fileBuffer, 'eng', { logger: (m) => console.log(m) });
  return result.data.text;
};

// Helper function to clean up extracted text
const cleanExtractedText = (text: string): string => {
  const resultedtext= text.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, ' ').trim();
  
  return resultedtext;
};

// Upload endpoint
app.post('/notes',addNote)
app.get('/notes',getNotes);
// Updated /upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const {title}=req.body;
    const fileKey = req.file.originalname;
    const fileBuffer = req.file.buffer;

    // Extract text from the file (PDF or image)
    let extractedText = "";
    if (fileKey.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(fileBuffer);
    } else {
      extractedText = await extractTextUsingOCR(fileBuffer);
    }

    // Clean the extracted text
    extractedText = cleanExtractedText(extractedText);

    if (!extractedText) {
      return res.status(400).json({ error: "Failed to extract text from the uploaded file." });
    }

    // Analyze the extracted text using AI
    const analysis = await analyzeContractWithAI(extractedText);

    // Optionally store the file and analysis in the database
    await FileModel.deleteOne({ fileKey }); // Remove previous document with the same fileKey
    const newFile = new FileModel({
      title,
      data: fileBuffer,
      extractedText,
      parsedResponse: analysis, // Store AI-generated summary
    });
    await newFile.save();

    // Send the summary in the response
    res.status(200).json({
      message: "File uploaded and analyzed successfully",
      summary: analysis.summary, // Include AI-generated summary
    });
  } catch (error) {
    console.error("Error uploading and processing file:", error);
    res.status(500).json({ error: "Failed to upload and process file." });
  }
});

app.get('/documents', async (req, res) => {
  try {
    // Fetch all documents from the FileModel
    const documents = await FileModel.find({}); // Fetch only necessary fields

    // Respond with the documents as JSON
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents." });
  }
});


app.get('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await FileModel.findById(id);  // Replace with your document fetching logic

    if (!document) {
      return res.status(404).send('Document not found');
    }

    res.set('Content-Type', 'application/pdf'); // Set the content type for PDFs
    res.send(document.data); // Send the PDF data
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).send('Error fetching document');
  }
});




// Analyze endpoint
// app.get("/analyze/:fileKey", async (req, res) => {
//   try {
//     const { fileKey } = req.params;

//     // Fetch file from MongoDB
//     const file = await FileModel.findOne({ fileKey });
//     if (!file) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     // Extract text from PDF
//     const text = await extractTextFromPDF(file.data);
//     console.log("Extracted Text: ", text);

//     // Validate extracted text
//     if (!text || text.trim().length === 0) {
//       return res.status(400).json({ error: "Failed to extract text from PDF" });
//     }

//     // Analyze contract text with AI
//     const analysis = await analyzeContractWithAI(text);
//     res.status(200).json({ analysis });
//   } catch (error) {
//     console.error("Error analyzing file:", error);
//     res.status(500).json({ error: "Failed to analyze file" });
//   }
// });


// Function to analyze contract using AI
// Function to analyze contract using AI
const analyzeContractWithAI = async (contractText: string): Promise<any> => {
  const prompt = `
    Analyze the following document and provide a brief summary in 2  lines  .
    Provide the response in JSON format with the following keys:
    - summary: the document summary.

    Document text:
    ${contractText.substring(0, 2000)}
  `;

  try {
    const results = await AI_MODEL_INSTANCE.generateContent(prompt);

    // Extract and clean response text
    let responseText = results.response.text().trim();

    // Remove any markdown code block markers (e.g., ```json or ```)
    responseText = responseText.replace(/```json|```/g, "").trim();


    


    // Parse the cleaned response text as JSON
    const parsedResponse = JSON.parse(responseText);


    


    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing contract with AI:", error);

    // Provide additional context for debugging
    if (error instanceof SyntaxError) {
      console.error("Response likely contains invalid JSON:", error.message);
    }

    throw new Error("Failed to analyze contract");
  }
};


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
