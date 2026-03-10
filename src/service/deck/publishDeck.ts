import fetcher from "../fetcher";
import type { DeckMode, DeckStatus } from "./types";

export type ReqPublishDeck = {
  path: {
    deckId: number;
  };
  body?: {
    name?: string;
    description?: string;
  };
};

export type ResPublishDeck = {
  id: number;
  name: string;
  description: string | null;
  status: DeckStatus;
  mode: DeckMode;
  updatedAt: string;
};

export const publishDeck = async (req: ReqPublishDeck) => {
  const result = await fetcher.post<ResPublishDeck>(
    `/decks/${req.path.deckId}/publish`,
    req.body ?? {}
  );
  return result.data;
};
