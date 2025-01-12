import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import DocumentViewer from './components/Documents';

import Documents from './components/Documents';
import Showingnotes from './components/showing-notes';

interface Document {
  _id: string;
  fileKey: string;
  parsedResponse?: {
    summary?: string;
  };
}


function App() {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Fetching document data from the server
  useEffect(() => {
    fetch('http://localhost:5000/documents')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Documents:', data);

        // Filter unique documents by `_id`
        const uniqueDocs = Array.from(new Map(data.map((doc:Document) => [doc._id, doc])).values());
        console.log('Unique Documents:', uniqueDocs);

        setDocuments(uniqueDocs);
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <BrowserRouter>
      
      <Routes>
        
        
          
          
            
              <Route path="/documents/:id" element={<DocumentViewerWrapper />} />
            

            
                
                <Route path='/' element={<Documents/>}/>
                <Route path='/documents' element={<Documents/>}/>
                <Route path='/notes' element={<Showingnotes/>}></Route>
                
              
           
        
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const  DocumentViewerWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Specify the expected params type
  return id ? <DocumentViewer documentId={id} /> : <p>Loading...</p>;
};

export default App;
