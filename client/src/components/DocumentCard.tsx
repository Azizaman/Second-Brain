import React, { useState, useEffect } from "react";
import axios from "axios";

interface Document {
  _id: string;
  fileKey: string;
  title: string;
  parsedResponse?: string;
}

const DocumentCard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch documents from the backend
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from Auth0
      const token = await localStorage.getItem("authToken");
      console.log("token received:", token);

      if (!token) {
        setError("No auth token found.");
        return;
      }

      const response = await axios.get("http://localhost:5000/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("get request token ", token);

      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to fetch documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific PDF document
  const fetchDocumentById = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from Auth0
      const token = await localStorage.getItem("authToken");

      if (!token) {
        setError("No auth token found.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Ensuring the response is a PDF
        }
      );
      if (response.data.size === 0) {
        throw new Error("Received empty PDF");
      }
      console.log(response);
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError("Failed to load document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup PDF URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // Fetch documents on initial render
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch selected document
  useEffect(() => {
    if (selectedDocument) {
      fetchDocumentById(selectedDocument);
    }
  }, [selectedDocument]);

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-screen ml80">
          <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 rounded-full"></div>
          <p className="ml-4 text-gray-800 dark:text-white">Loading...</p>
        </div>
      )}

      <div className="flex flex-col min-h-screen p-4 bg-gray-100 dark:bg-black">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Document Viewer
        </h1>

        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-10">
              {documents.map((document) => (
                <div
                  key={document._id}
                  className="border rounded-lg p-4 shadow-md bg-gray-200 dark:bg-sidebar dark:text-white"
                >
                  <h2 className="text-lg font-semibold truncate">
                    {document.title || document.fileKey}
                  </h2>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                    {document.parsedResponse || "No summary available"}
                  </p>
                  <button
                    onClick={() => setSelectedDocument(document._id)}
                    className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    View Document
                  </button>
                </div>
              ))}
            </div>

           {/* PDF Viewer */}
           {selectedDocument && pdfUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
                  <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full h-[600px] border rounded-md"
                  ></iframe>
                  <button
                    onClick={() => {
                      setSelectedDocument(null);
                      setPdfUrl(null); // Clear PDF URL
                    }}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default DocumentCard;