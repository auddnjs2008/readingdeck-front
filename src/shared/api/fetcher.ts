import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { refresh } from "@/shared/api/auth/refresh";
import { API_TIMEOUT_MS, claimAuthRetry } from "@/shared/api/auth-retry";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const PUBLIC_PATHS = new Set(["/", "/login", "/terms", "/privacy", "/support"]);

const shouldSkipAuthRedirect = () => {
  if (typeof window === "undefined") return false;
  const { pathname } = window.location;
  return (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/book-info/") ||
    pathname === "/feedback" ||
    pathname === "/community" ||
    pathname.startsWith("/community/")
  );
};

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
  timeout: API_TIMEOUT_MS,
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

    if (status === 401) {
      if (!claimAuthRetry(originalRequestConfig)) {
        if (typeof window !== "undefined" && !shouldSkipAuthRedirect()) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequestConfig });
        });
      } else {
        isRefreshing = true;
        try {
          await refresh();
          processQueue(null);
          return fetcher(originalRequestConfig);
        } catch (e) {
          processQueue(e);
          if (axios.isAxiosError(e) && e.response?.status === 401 &&
              typeof window !== "undefined" && !shouldSkipAuthRedirect()) {
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
