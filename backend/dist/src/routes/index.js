"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentUpload_1 = require("../controllers/documentUpload");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
// Define the route for document upload
router.post('/upload', uploadMiddleware_1.default.single('file'), documentUpload_1.uploadDocument);
exports.default = router;
