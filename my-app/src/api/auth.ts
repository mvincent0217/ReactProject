import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
export const registerUser = async (userData: any) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials: any) => {
    return axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
};

export const logoutUser = async () => {
    return axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};


