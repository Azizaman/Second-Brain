import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export const useCustomGoogleLogin = () => {
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        // Note: useGoogleLogin with implicit flow returns an access_token
        // To get the ID token, you may need to use the Google API or adjust the flow
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`,
          },
        });
        const userInfo = res.data; // Contains sub, email, name, etc.
        const idToken = userInfo.id_token; // Use id_token from userinfo response

        if (!idToken) {
          console.error("ID token not available, consider using auth-code flow");
          return;
        }

        const loginRes = await axios.post("https://second-brain-backend-tdy4.onrender.com/login", {
          token: idToken, // Send ID token
        });

        const { token } = loginRes.data;
        localStorage.setItem("authToken", token);
        window.location.href = "/documents";
      } catch (err: any) {
        console.error("Login failed:", err.message);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
    flow: "implicit", // Note: implicit flow may not provide id_token directly
  });

  return login;
};