import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("wtc_token");
  const requestPath = String(config.url || "");
  const isAdminRequest = requestPath.startsWith("/api/admin");

  if (isAdminRequest && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message || "");
    const requestPath = String(error?.config?.url || "");
    const isAdminRequest = requestPath.startsWith("/api/admin");

    if (
      status === 401 &&
      !isAdminRequest &&
      message.toLowerCase().includes("session expired")
    ) {
      localStorage.removeItem("wtc_token");
      localStorage.removeItem("wtc_user");
    }

    return Promise.reject(error);
  }
);
