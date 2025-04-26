import React, { useState } from 'react';
import axios from 'axios';

export function AddnotesButton() {
  const [add, setAdd] = useState(false); // State to toggle form visibility
  const [title, setTitle] = useState(''); // State to store the title
  const [content, setContent] = useState(''); // State to store the content
  const [loading, setLoading] = useState(false); // State to indicate request progress

  async function handleSubmit() {
    if (title && content) {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      try {
        const token=await localStorage.getItem('authToken');
        const response = await axios.post('https://second-brain-backend-tdy4.onrender.com/notes', {
            title,
            content
        },{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        console.log('The notes data is saved successfully:', response,{
            headers: {
                'Content-Type': 'multipart/form-data',
              },
      },response.data);

        setTitle('');
        setContent('');
        window.location.reload()
        alert('Document added successfully!');
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload notes. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in both the title and content.');
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setAdd(!add)} // Toggle form visibility
        className="bg-blue-500 text-white py-2 px-2 mt-6 rounded"
      >
        {add ? 'Close Form' : 'Add Notes'}
      </button>

      {add && (
        <div className="mt-4 p-4 border rounded shadow-sm bg-gray-400 dark:bg-sidebar">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded text-black bg-gray-300"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-2 border rounded text-black bg-gray-300"
              placeholder="Enter content"
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
}
