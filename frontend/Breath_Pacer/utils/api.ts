// utils/api.ts
import axios from "axios";

const API_BASE = "http://192.168.2.13:8000"; // 👈 replace with your laptop’s local IP or ngrok URL

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});
export default api;

// Example endpoints
export const registerUser = async (email: string, password: string) => {
    const response = await api.post("/api/register/", { email, password });
    return response.data;
};

export const getUserProfile = async (token: string) => {
    const response = await api.get("/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
