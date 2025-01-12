import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom"; // Correct Link import for React Router
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";

import axios from "axios";

interface NotesInter {
  _id: string;
  title: string;
  Content: string;
}

export default function Showingnotes() {
  const [notes, setNotes] = useState<NotesInter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/notes")
      .then((response) => {
        console.log("The response of the notes:", response.data);
        setNotes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the notes:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500"></div>
          <p className="text-gray-800 dark:text-white mt-4 ml-4">Loading...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="border rounded-lg p-4 shadow-md bg-gray-400 dark:bg-sidebar dark:text-white"
            >
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-black dark:text-white text-sm mt-2">
                {note.Content || "No summary available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


