import fetcher from "../fetcher";
import type { DeckStatus } from "./types";

export type ReqUpdateDeck = {
  path: {
    deckId: number;
  };
  body: {
    name?: string;
  };
};

export type ResUpdateDeck = {
  id: number;
  name: string;
  status: DeckStatus;
  updatedAt: string;
};

export const updateDeck = async (req: ReqUpdateDeck) => {
  const result = await fetcher.patch<ResUpdateDeck>(`/decks/${req.path.deckId}`, req.body);
  return result.data;
};
