import fetcher from "../fetcher";
import type { DeckMode, DeckStatus } from "./types";

export type ReqUpdateDeck = {
  path: {
    deckId: number;
  };
  body: {
    name?: string;
    mode?: DeckMode;
  };
};

export type ResUpdateDeck = {
  id: number;
  name: string;
  status: DeckStatus;
  mode: DeckMode;
  updatedAt: string;
};

export const updateDeck = async (req: ReqUpdateDeck) => {
  const result = await fetcher.patch<ResUpdateDeck>(`/decks/${req.path.deckId}`, req.body);
  return result.data;
};
