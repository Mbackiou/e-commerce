import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// ✅ Instance PUBLIQUE — sans token (pour les produits)
const APIPublic = axios.create({
    baseURL: BASE_URL,
});

// ✅ Instance PRIVÉE — avec token (pour les actions protégées)
const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 🔓 Public — pas besoin de token
export const getProduits = async() => {
    const response = await APIPublic.get("/products/");
    return response.data;
};

// 🔒 Privé — nécessite un token
export const login = async(username, password) => {
    const response = await APIPublic.post("/login/", { username, password });
    return response.data;
};

export const register = async(username, email, password) => {
    const response = await APIPublic.post("/register/", { username, email, password });
    return response.data;
};

export default API;