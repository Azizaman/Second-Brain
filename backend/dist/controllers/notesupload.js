var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../config/firebase.js";
export const addNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const newNote = { title, content, createdAt: new Date() };
        const docRef = yield db.collection("notes").add(newNote);
        res.status(201).json(Object.assign({ id: docRef.id }, newNote));
    }
    catch (error) {
        console.log("error adding the notes", error);
        res.status(500).json({ error: "error adding the notes" });
    }
});
export const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield db.collection("notes").get();
        const notes = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(notes);
    }
    catch (error) {
        console.error("Error retrieving notes:", error);
        res.status(500).json({ message: "Error retrieving notes" });
    }
});
