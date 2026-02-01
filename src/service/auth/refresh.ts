import axios from "axios";

export const refresh = async () => {
  const refreshClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await refreshClient.post("/auth/refresh", {});
  return result.data;
};
