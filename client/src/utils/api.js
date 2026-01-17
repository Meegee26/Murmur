import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const api = {
  requestOtp: async (email) => {
    const response = await apiClient.post("/auth/request-otp", { email });
    return response.data;
  },

  signUp: async (credentials) => {
    const response = await apiClient.post("/auth/sign-up", credentials);
    if (response.data.data.token) {
      localStorage.setItem("authToken", response.data.data.token);
    }
    return response.data;
  },

  signIn: async (credentials) => {
    const response = await apiClient.post("/auth/sign-in", credentials);
    if (response.data.data.token) {
      localStorage.setItem("authToken", response.data.data.token);
    }
    return response.data;
  },

  googleSignIn: async (idToken) => {
    const response = await apiClient.post("/auth/google", { idToken });
    if (response.data.data.token) {
      localStorage.setItem("authToken", response.data.data.token);
    }
    return response.data;
  },

  signOut: async () => {
    const response = await apiClient.post("/auth/sign-out");
    localStorage.removeItem("authToken");
    return response.data;
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await apiClient.get("/auth/check-auth");
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get(`/users?search=${query}`);
    return response.data;
  },

  getUserChats: async () => {
    const response = await apiClient.get("/chats/all");
    return response.data;
  },

  getChatDetails: async (chatId) => {
    const response = await apiClient.get(`/chats/${chatId}`);
    return response.data;
  },

  createChat: async (data) => {
    const response = await apiClient.post("/chats/create", data);
    return response.data;
  },

  sendMessage: async (data) => {
    const response = await apiClient.post("/chats/message/send", data);
    return response.data;
  },

  markAsRead: async (chatId) => {
    const response = await apiClient.patch(`/chats/${chatId}/read`);
    return response.data;
  },
};

export default apiClient;
