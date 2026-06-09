import "server-only";

import type {
  ReqGetCardDetail,
  ResGetCardDetail,
} from "@/entities/card/api/getCardDetail";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getCardDetailServer = async (req: ReqGetCardDetail) => {
  return serverFetcher<ResGetCardDetail>(`/cards/${req.path.cardId}`);
};
