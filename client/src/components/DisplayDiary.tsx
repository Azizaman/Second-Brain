import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Define the shape of a diary entry
interface DiaryEntry {
  _id: string;
  title?: string;
  content: string;
  createdAt: string;
}

const DisplayDiary: React.FC = () => {
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const fetchDiary = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get<DiaryEntry[]>(
        "https://second-brain-backend-tdy4.onrender.com/diary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiary(response.data);

    } catch (error) {
      const err = error as AxiosError;
      console.error("Error fetching diary entries:", err);

      if (err.response?.status === 401) {
        setErrorMessage("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/");
      } else {
        setErrorMessage("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDiaryEntry = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`https://second-brain-backend-tdy4.onrender.com/diary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDiary((prevDiary) => prevDiary.filter((entry) => entry._id !== id));
      alert("Diary entry deleted successfully!");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error deleting diary entry:", err);

      if (err.response?.status === 401) {
        setErrorMessage("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        alert("Failed to delete diary entry. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddDiary = () => {
    navigate("/add-diary");
  };

  const handleViewDiary = (diaryId: string) => {
    navigate(`/diary/${diaryId}`);
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 ">
        <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          {errorMessage}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 md:px-12 lg:px-24 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white ml-36">
          My Diary
        </h1>
        <button
          onClick={handleAddDiary}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
        >
          + Add Entry
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 rounded-full"></div>
          <p className="ml-4 text-gray-800 dark:text-white">Loading...</p>
        </div>
      ) : diary.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          No diary entries found. Start writing your thoughts today!
        </p>
      ) : (
        <div className="space-y-6 sm:space-y-8 ">
          {diary.map((entry, index) => (
            <div key={entry._id} className="relative">
              {(index === 0 ||
                formatDate(entry.createdAt) !==
                  formatDate(diary[index - 1]?.createdAt)) && (
                <h2 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                  {formatDate(entry.createdAt)}
                </h2>
              )}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
                    {entry.title || "Untitled"}
                  </h3>
                  <button
                    onClick={() => deleteDiaryEntry(entry._id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p
                  className="text-gray-600 dark:text-gray-300 mt-3 text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {entry.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayDiary;
