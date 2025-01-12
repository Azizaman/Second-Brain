"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
// Path to your service account key
const serviceAccountPath = path_1.default.resolve(__dirname, "../../serviceAccountKey.json" // Update path based on your folder structure
);
// Initialize Firebase Admin SDK
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(require(serviceAccountPath)),
        databaseURL: "https://<your-database-name>.firebaseio.com", // Replace with your database URL
    });
}
const db = firebase_admin_1.default.firestore(); // Firestore reference
exports.db = db;
const auth = firebase_admin_1.default.auth(); // Auth reference (if needed)
exports.auth = auth;
