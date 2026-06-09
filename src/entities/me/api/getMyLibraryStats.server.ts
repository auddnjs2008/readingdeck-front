import "server-only";

import { serverFetcher } from "@/shared/api/server-fetcher";
import type { ResGetMyLibraryStats } from "./getMyLibraryStats";

export const getMyLibraryStatsServer = async () => {
  return serverFetcher<ResGetMyLibraryStats>("/me/library-stats");
};
