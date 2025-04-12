import React, { useEffect, useState } from "react";
import axios from "axios";

interface NotesInter {
  _id: string;
  title: string;
  content: string;
  createdAt: number;
}

export default function Showingnotes() {
  const [notes, setNotes] = useState<NotesInter[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("http://localhost:5000/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("The response of the notes:", response.data.notes);
        setNotes(response.data.notes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the notes:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 md:px-12 lg:px-24 w-full overflow-x-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-blue-500 rounded-full"></div>
          <p className="text-gray-800 dark:text-white ml-4">Loading...</p>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          No notes found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white">
          Notes Viewer
        </h1>
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
                {note.title || "Untitled"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                {note.content || "No content available"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Created At: {formatDate(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
