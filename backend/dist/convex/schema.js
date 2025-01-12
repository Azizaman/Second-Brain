"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("convex/server");
const values_1 = require("convex/values");
// Define the schema
exports.default = (0, server_1.defineSchema)({
    messages: (0, server_1.defineTable)({
        storageId: values_1.v.string(), // Required: Storage ID for the uploaded file
        author: values_1.v.optional(values_1.v.string()), // Optional: Name of the uploader
        fileType: values_1.v.optional(values_1.v.string()), // Optional: File type (e.g., "image", "document")
        fileName: values_1.v.optional(values_1.v.string()), // Optional: File name
        fileSize: values_1.v.optional(values_1.v.number()), // Optional: File size in bytes
        timestamp: values_1.v.number(), // Required: Timestamp of the upload
    }),
});
