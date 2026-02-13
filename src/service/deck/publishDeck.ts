import fetcher from "../fetcher";
import type { DeckStatus } from "./types";

export type ReqPublishDeck = {
  path: {
    deckId: number;
  };
  body?: {
    name?: string;
  };
};

export type ResPublishDeck = {
  id: number;
  name: string;
  status: DeckStatus;
  updatedAt: string;
};

export const publishDeck = async (req: ReqPublishDeck) => {
  const result = await fetcher.post<ResPublishDeck>(
    `/decks/${req.path.deckId}/publish`,
    req.body ?? {}
  );
  return result.data;
};

