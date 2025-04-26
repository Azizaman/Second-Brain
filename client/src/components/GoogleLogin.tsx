import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post("https://second-brain-backend-tdy4.onrender.com/login", {
        token: credentialResponse.credential, // Send ID token
      });

      const { token } = res.data;
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);
      window.location.href = "/documents";
    } catch (err: any) {
      console.error("Login failed:", err.message);
    }
  };

  const handleLoginFailure = () => {
    console.error("Google Login Failed");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}