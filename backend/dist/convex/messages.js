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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFile = exports.generateUploadUrl = void 0;
const server_1 = require("./_generated/server");
// Mutation to generate an upload URL
exports.generateUploadUrl = (0, server_1.mutation)((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.storage.generateUploadUrl();
}));
// Mutation to handle file metadata
exports.sendFile = (0, server_1.mutation)((ctx, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { storageId, author, fileType, fileName, fileSize } = args;
    if (!storageId || !fileType || !fileName || !fileSize) {
        throw new Error("Missing required file metadata.");
    }
    const timestamp = Date.now();
    // Insert the file metadata into the "messages" table
    yield ctx.db.insert("messages", {
        storageId,
        author: author || "Anonymous",
        fileType,
        fileName,
        fileSize,
        timestamp,
    });
}));
