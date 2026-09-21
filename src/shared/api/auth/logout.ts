import axios from "axios";
import { API_TIMEOUT_MS } from "@/shared/api/auth-retry";

export async function logout() {
  // Logout must not refresh an expired session through the shared interceptor.
  await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {}, {
    withCredentials: true,
    timeout: API_TIMEOUT_MS,
  });
}
