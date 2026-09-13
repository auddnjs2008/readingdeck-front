import axios from "axios";
import { API_TIMEOUT_MS } from "@/shared/api/auth-retry";

export const refresh = async () => {
  const refreshClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: API_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await refreshClient.post("/auth/refresh", {});
  return result.data;
};
