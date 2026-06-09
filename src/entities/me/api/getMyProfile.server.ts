import "server-only";

import { serverFetcher } from "@/shared/api/server-fetcher";
import type { ResGetMyProfile } from "./getMyProfile";

export const getMyProfileServer = async () => {
  return serverFetcher<ResGetMyProfile>("/me");
};
