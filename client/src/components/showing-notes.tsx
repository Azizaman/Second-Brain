import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: number | string; // Flexible type to handle different backend formats
}

export default function Showingnotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setErrorMessage("Please log in to view your notes.");
      navigate("/");
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await axios.get("https://second-brain-backend-tdy4.onrender.com/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("The response of the notes:", response.data.notes);
        setNotes(response.data.notes || []); // Fallback to empty array
        setLoading(false);
      } catch (error) {
        const err = error as AxiosError;
        console.error("Error fetching notes:", err);

        if (err.response?.status === 401) {
          setErrorMessage("Your session has expired. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/");
        } else {
          setErrorMessage("Failed to load notes. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate, token]);

  const formatDate = (timestamp: number | string): string => {
    const date = new Date(
      typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp
    );
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString(undefined, {
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-800 dark:text-white ml-4 text-lg">Loading...</p>
        </div>
      ) : errorMessage ? (
        <div className="text-center text-red-600 dark:text-red-400 text-lg sm:text-xl">
          {errorMessage}
        </div>
      ) : notes.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          No notes found.
        </p>
      ) : (
        <div className="w-full">
          {/* Notes Viewer Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Notes Viewer
          </h1>

          {/* Notes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between h-full min-w-[250px]"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
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
        </div>
      )}
    </div>
  );
}