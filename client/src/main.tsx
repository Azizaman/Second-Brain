import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';



createRoot(document.getElementById('root')!).render(
  
    
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        
        
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <App />
      </GoogleOAuthProvider>

     
      </ThemeProvider>
      
    
    
    
  
)
