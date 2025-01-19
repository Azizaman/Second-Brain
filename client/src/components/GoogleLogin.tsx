import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse; // JWT token from Google
      // Send the credential (JWT) to your backend for verification
      const res = await axios.post("http://localhost:5000/login", { token: credential });

      const { token } = res.data;
      localStorage.setItem("authToken", token); // Save the JWT token in localStorage
      window.location.href = "/documents"; // Redirect to the documents page
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  const handleLoginFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
