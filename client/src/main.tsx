import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from './components/theme-provider.tsx';


createRoot(document.getElementById('root')!).render(
  
    <Auth0Provider
      domain="dev-x6hqjvgwi77i622s.us.auth0.com"
      clientId="FoKaMj6LNWHbsHupstrjelO00XDrMlfp"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        
        
     

      <App />
     
      </ThemeProvider>
      
    </Auth0Provider>
    
    
  
)
