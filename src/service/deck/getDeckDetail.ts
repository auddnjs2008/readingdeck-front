import fetcher from "../fetcher";
import type { DeckBase, DeckGraphConnection, DeckGraphNode } from "./types";

export type ReqGetDeckDetail = {
  path: {
    deckId: number;
  };
};

export type ResGetDeckDetail = DeckBase & {
  isShared: boolean;
  sharedPostId: number | null;
  nodes: DeckGraphNode[];
  connections: DeckGraphConnection[];
};

export const getDeckDetail = async (req: ReqGetDeckDetail) => {
  const result = await fetcher.get<ResGetDeckDetail>(`/decks/${req.path.deckId}`);
  return result.data;
};
