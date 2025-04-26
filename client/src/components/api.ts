import axios from "axios";

const api=axios.create({
    baseURL:'https://second-brain-backend-tdy4.onrender.com/auth'
});
export const googleAuth=(code: string)=>api.get(`/google?code=${code}`);