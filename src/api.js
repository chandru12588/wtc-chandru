import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// AUTO SEND ADMIN TOKEN
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("wtc_admin_token");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});
