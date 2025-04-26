import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import DocumentViewer from './components/DocumentViewer'; // Fixed import
import  Documents  from './components/Documents';
import Login from './components/GoogleLogin';
import { Notes } from './components/Notes';
import Diary from './components/Diary';
import AddDiary from './components/AddDiary';
import DiaryDetails from './components/DiaryDetails';
import CalenderSidebar from './components/CalenderSidebar';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/documents/:id" element={<DocumentViewerWrapper />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/add-diary" element={<AddDiary />} />
          <Route path="/diary/:diaryId" element={<DiaryDetails />} />
          <Route path="/calendar" element={<CalenderSidebar />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const DocumentViewerWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <DocumentViewer documentId={id} /> : <p>Loading...</p>;
};

export default App;