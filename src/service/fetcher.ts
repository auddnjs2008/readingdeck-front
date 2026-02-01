import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { refresh } from "./auth/refresh";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(fetcher(config));
    }
  });
  failedQueue = [];
};

const fetcher: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequestConfig = error.config;

    if (!originalRequestConfig) {
      return Promise.reject(error);
    }

    if (status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequestConfig });
        }).catch((err) => Promise.reject(err));
      } else {
        isRefreshing = true;
        try {
          await refresh();
          processQueue(null);
          return fetcher(originalRequestConfig);
        } catch (e) {
          processQueue(e);
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default fetcher;
