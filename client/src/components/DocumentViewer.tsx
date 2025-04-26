import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface DocumentViewerProps {
  documentId: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    axios
      .get(`https://second-brain-backend-tdy4.onrender.com/documents/${documentId}`, { responseType: 'blob' })
      .then((response) => {
        url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      })
      .catch((error) => {
        console.error('Error fetching PDF:', error.message, error.response?.status);
        setError('Failed to load document. Please try again.');
      });

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [documentId]);

  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;
  if (!pdfUrl) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="flex justify-center items-center p-4 w-full h-[80vh]">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfUrl} />
      </Worker>
    </div>
  );
};

export default DocumentViewer;