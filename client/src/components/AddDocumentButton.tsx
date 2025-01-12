import React, { useState } from 'react';
import axios from 'axios';

const AddDocumentButton = () => {
  const [add, setAdd] = useState(false); // State to toggle form visibility
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null); // To store the uploaded file
  const [loading, setLoading] = useState(false); // State to indicate request progress

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Update the file state
    }
  };

  const handleSubmit = async () => {
    if (title && file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response:', response.data);

        // Reset the form after successful submission
        setTitle('');
        setFile(null);
        setAdd(false);
        alert('Document added successfully!');
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload document. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setAdd(!add)} // Toggle form visibility
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {add ? 'Close Form' : 'Add Document'}
      </button>

      {add && (
        <div className="mt-4 p-4 border rounded shadow-sm bg-gray-400 dark:bg-sidebar">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded text-black"
              placeholder="Enter document title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mt-1"
            />
          </div>
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-green-500'}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddDocumentButton;
