import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

const DiaryDetails: React.FC = () => {
  const { diaryId } = useParams(); // Extract diaryId from URL params
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null); // Specify type
  const [loading, setLoading] = useState(false);

  const fetchDiaryEntry = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`https://second-brain-backend-tdy4.onrender.com/diary/${diaryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data); // Debugging
      if (response.data.length > 0) {
        setDiaryEntry(response.data[0]); // Get the first diary entry
      } else {
        setDiaryEntry(null); // Handle empty response
      }
    } catch (error) {
      console.error("Error fetching diary entry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaryEntry();
  }, [diaryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (!diaryEntry) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-white">Diary entry not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {diaryEntry.title || "Untitled"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 italic mb-6">
          Mood: {diaryEntry.mood || "Neutral"}
        </p>
        <div
          className="text-gray-700 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: diaryEntry.content }}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {new Date(diaryEntry.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default DiaryDetails;
