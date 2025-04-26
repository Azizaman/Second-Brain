import React, { useState, useEffect } from "react";
import axios from "axios";


interface Document {
  _id: string;
  fileKey: string;
  title: string;
  parsedResponse?: string;
}

export const DocumentCard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No auth token found.");
        return;
      }

      const response = await axios.get("https://second-brain-backend-tdy4.onrender.com/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to fetch documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentById = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No auth token found.");
        return;
      }

      const response = await axios.get(
        `https://second-brain-backend-tdy4.onrender.com/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      if (response.data.size === 0) {
        throw new Error("Received empty PDF");
      }

      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError("Failed to load document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocument) {
      fetchDocumentById(selectedDocument);
    }
  }, [selectedDocument]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      
  
      <div className="w-full px-4 py-8 sm:px-6 md:px-12 lg:px-24 overflow-x-hidden">
        {loading && (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 rounded-full"></div>
            <p className="ml-4 text-gray-800 dark:text-white">Loading...</p>
          </div>
        )}
  
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white">
            Document Viewer
          </h1>
  
          {error && (
            <div className="text-center text-red-500 font-medium">{error}</div>
          )}
  
          {!loading && !error && documents.length === 0 && (
            <p className="text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              No documents uploaded yet.
            </p>
          )}
  
          {!loading && !error && documents.length > 0 && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document) => (
                <div
                  key={document._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col justify-between min-h-[350px]"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white break-words">
                    {document.title || document.fileKey}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                    {document.parsedResponse || "No summary available"}
                  </p>
                  <button
                    onClick={() => setSelectedDocument(document._id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    View Document
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* PDF Viewer Modal */}
        {selectedDocument && pdfUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-hidden">
              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                className="w-full h-[500px] rounded-md border"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setSelectedDocument(null);
                    setPdfUrl(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  