import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include Quill's CSS
import axios from "axios";

const AddDiary: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Function to strip HTML tags from the Quill content
  const cleanQuillContent = (rawContent: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawContent;
    return tempDiv.textContent || tempDiv.innerText || ""; // Extract plain text
  };

  const handleSaveDiary = async () => {
    if (!title || !mood || !content.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const token = await localStorage.getItem("authToken");
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const cleanedContent = cleanQuillContent(content); // Clean content before saving

      await axios.post(
        "https://second-brain-backend-tdy4.onrender.com/diary",
        {
          title,
          mood,
          content: cleanedContent, // Save the plain text content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Diary entry saved successfully!");
      setTitle("");
      setMood("");
      setContent("");
    } catch (error) {
      console.error("Failed to save diary entry:", error);
      setErrorMessage("Failed to save diary entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll the container to the top whenever content changes
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 flex justify-center items-center overflow-y-auto"
    >
      <div className="w-full max-w-5xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Write Your Diary
        </h1>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-xl text-gray-300 font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-600 text-gray-100 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter title for the day"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Mood Dropdown */}
        <div className="mb-6">
          <label className="block text-xl text-gray-300 font-semibold mb-2">
            Mood
          </label>
          <select
            className="w-full px-4 py-3 bg-gray-600 text-gray-100 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="" disabled>
              Select your mood
            </option>
            <option value="happy">Happy 😊</option>
            <option value="sad">Sad 😢</option>
            <option value="neutral">Neutral 😐</option>
            <option value="excited">Excited 😄</option>
            <option value="angry">Angry 😡</option>
          </select>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <label className="block text-xl text-gray-300 font-semibold mb-2">
            Diary Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(value) => setContent(value)}
            placeholder="Write your diary here..."
            className="bg-gray-600 text-gray-100 rounded-lg"
            style={{ minHeight: "100px" }}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveDiary}
            disabled={loading}
            className={`px-6 py-3 text-xl font-bold rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <p className="mt-6 text-center text-lg text-green-400">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-6 text-center text-lg text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddDiary;
