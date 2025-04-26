import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import bgImage from "@/assets/ai-landing-bg.png";
import { useNavigate } from "react-router-dom";
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-5xl drop-shadow-xl">
          Welcome to <span className="text-blue-500">Second Brain</span> —<br className="hidden md:block" />
          Your <span className="text-violet-400">AI-powered</span> Digital Mind
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
          Second Brain helps you <span className="text-blue-400 font-semibold">capture</span> thoughts,
          <span className="text-green-400 font-semibold"> connect ideas</span>, and
          <span className="text-yellow-400 font-semibold"> recall knowledge</span> — like your own personal
          memory assistant powered by <span className="text-pink-400 font-semibold">intelligent AI</span>.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch("https://second-brain-backend-tdy4.onrender.com/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token: credentialResponse.credential }),
                });

                const data = await res.json();
                if (data.token) {
                  localStorage.setItem("authToken", data.token);
                  
                  navigate("/documents");

                } else {
                  console.error("Login failed", data.message);
                }
              } catch (error) {
                console.error("Login error:", error);
              }
            }}
            onError={() => {
              console.error("Google Login Failed");
            }}
          />
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black text-base px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Explore Features
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm text-white/70 z-20">
        Developed by <span className="font-semibold text-white">Abdul Aziz Aman</span> —
        <a href="mailto:azizamanaaa123@email.com" className="underline hover:text-blue-400 ml-1">
          azizamanaaa123@email.com
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;