import "server-only";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getMyHomeSummaryServer = async () => {
  return serverFetcher<ResGetMyHomeSummary>("/me/home-summary");
};
