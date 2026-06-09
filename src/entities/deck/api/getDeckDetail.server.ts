import "server-only";

import type {
  ReqGetDeckDetail,
  ResGetDeckDetail,
} from "@/entities/deck/api/getDeckDetail";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getDeckDetailServer = async (req: ReqGetDeckDetail) => {
  return serverFetcher<ResGetDeckDetail>(`/decks/${req.path.deckId}`);
};
