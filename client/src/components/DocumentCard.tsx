import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Document {
  _id: string;
  fileKey: string;
  title: string;
  parsedResponse?: {
    summary?: string;
  };
}

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetching document data from the server
  useEffect(() => {
    axios
      .get('http://localhost:5000/documents')
      .then((response) => {
        console.log('Fetched Documents:', response.data);

        // Filter unique documents by `_id`
        const uniqueDocs = Array.from(
          new Map(response.data.map((doc: Document) => [doc._id, doc])).values()
        );
        console.log('Unique Documents:', uniqueDocs);

        setDocuments(uniqueDocs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
        setLoading(false); // Ensure loader stops on error
      });
  }, []);

  // Fetch PDF when a document is selected
  useEffect(() => {
    if (selectedDocument) {
      setLoading(true); // Show loader while fetching the PDF
      axios
        .get(`http://localhost:5000/documents/${selectedDocument}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data); // Convert blob to a URL
          setPdfUrl(url);
          setLoading(false); // Stop loader when done
        })
        .catch((error) => {
          console.error('Error fetching document:', error);
          setLoading(false);
        });
    }
  }, [selectedDocument]);

  return (
    <div>

{loading && (
        <div className="flex justify-end  h-screen  pl-96 ">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 "></div>
          <p className="text-gray-800 dark:text-white mt-4">Loading...</p>
        </div>
      )}

    


    
   
    <div className="flex flex-col h-screen p-4 bg-gray-100 dark:bg-black">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        Document Viewer
      </h1>

      {/* Loader */}
      

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {documents.map((document) => (
              <div
                key={document._id}
                className="border rounded-lg p-4 shadow-md bg-gray-400 dark:bg-sidebar  dark:text-white"
              >
                <h2 className="text-lg font-semibold">
                  {document.title || document.fileKey}
                </h2>
                <p className="text-black dark:text-white text-sm mt-2">
                  {document.parsedResponse?.summary || 'No summary available'}
                </p>
                <button
                  onClick={() => setSelectedDocument(document._id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  View Document
                </button>
              </div>
            ))}
          </div>

          {/* PDF Viewer Section */}
          {selectedDocument && pdfUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-sidebar p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
                <iframe
                  src={pdfUrl}
                  title="PDF Viewer"
                  className="w-full h-[600px] border rounded-md"
                ></iframe>
                <button
                  onClick={() => {
                    setSelectedDocument(null);
                    setPdfUrl(null); // Clear the URL
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

export default App;

