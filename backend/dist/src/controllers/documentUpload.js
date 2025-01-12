"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const supabaseClient_1 = __importDefault(require("../config/supabaseClient")); // Import the Supabase client
const multer_1 = __importDefault(require("multer"));
// Set storage engine to memory storage (we'll use file buffer directly)
const storage = multer_1.default.memoryStorage();
// Initialize multer with storage configuration
const upload = (0, multer_1.default)({ storage: storage });
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Extract the file from the request
        const file = req.file;
        const filePath = `documents/${file.originalname}`; // Path where the file will be stored
        // Upload the file to Supabase Storage
        const { data, error } = yield supabaseClient_1.default.storage
            .from('second_brain_pdf') // Bucket name from Supabase
            .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false, // Don't overwrite existing files with the same name
        });
        if (error) {
            throw error;
        }
        // Get the public URL for the uploaded file
        const publicUrlData = supabaseClient_1.default.storage
            .from('second_brain_pdf')
            .getPublicUrl(filePath);
        // Access the public URL from the 'data' object
        const publicURL = publicUrlData.data.publicUrl;
        return res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: publicURL, // Now you can use the public URL here
        });
    }
    catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({ message: 'Failed to upload document', error });
    }
});
exports.uploadDocument = uploadDocument;
