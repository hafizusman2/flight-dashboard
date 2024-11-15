import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./auth";
import { config } from "./config";
// import { AppDispatch } from "@/app/lib/store";

const {
  api: { baseURL }
} = config;

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Reassign the interceptors to the existing axiosClient instance
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const setupAxiosClient = (): void => {
  // Reassign the interceptors to the existing axiosClient instance
  axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

export default axiosClient;
