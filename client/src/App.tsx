import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import DocumentViewer from './components/Documents';
import Login from './components/GoogleLogin';

import Documents from './components/Documents';
import { Notes } from './components/notes';
import Diary from './components/Diary';
import DisplayDiary from './components/DisplayDiary';
import AddDiary from './components/AddDiary';
import DiaryDetails from './components/DiaryDetails';
import { Calendar } from 'lucide-react';
import MyCalendar from './components/MyCalendar';
import CalenderSidebar from './components/CalenderSidebar';
import LandingPage from './components/LandingPage';





function App() {
  

  
      

  return (
    <div className="flex flex-col h-screen">
      <BrowserRouter>
      
      <Routes>
        
        
          
          
            
              <Route path="/documents/:id" element={<DocumentViewerWrapper />} />
            

            
                
                <Route path='/documents' element={<Documents/>}/>
                <Route path='/documents' element={<Documents/>}/>
                <Route path='/notes' element={<Notes/>}></Route>
                
                <Route path='/login' element={<Login/>}/>
                <Route path='/diary' element={<Diary/>}/>
                <Route path='/add-diary' element={<AddDiary/>}/>
                <Route path="/diary/:diaryId" element={<DiaryDetails/>} />
                <Route path="/calendar" element={<CalenderSidebar/>} />
                <Route path="/" element={<LandingPage />} />
                
              
           
        
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
