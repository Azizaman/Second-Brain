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
const express_1 = __importDefault(require("express"));
const notesupload_1 = require("./controllers/notesupload"); // Adjust path if needed
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});
app.use('/api', routes_1.default);
// Routes
app.post("/notes", notesupload_1.addNote);
app.get("/notes", notesupload_1.getNotes);
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const stream = require('stream');
const upload = multer(); // Multer for file handling
const uri = 'mongodb+srv://azizamanaaa97:2s3354LUZe0BzSu7@cluster0.tyjfznw.mongodb.net/second-brain';
const client = new MongoClient(uri);
let bucket;
// Connect to MongoDB and setup GridFS
client.connect().then(() => {
    const db = client.db('fileStorage');
    bucket = new GridFSBucket(db, { bucketName: 'files' });
});
// Fetch all files
app.get('/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield bucket.find().toArray();
        res.json(files);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
// Serve a specific file
app.get('/files/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        const fileStream = yield downloadFile(fileId); // Reuse the utility function
        fileStream.pipe(res).on('error', (err) => {
            res.status(404).send('File not found');
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
// Upload a file
const { uploadFile, downloadFile } = require('./fileUtils'); // Import the utility functions
// Upload endpoint using uploadFile
app.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalname, buffer } = req.file;
        yield uploadFile(originalname, buffer); // Reuse the utility function
        res.status(200).send('File uploaded successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
