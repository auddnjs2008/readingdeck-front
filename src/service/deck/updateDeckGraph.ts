import fetcher from "../fetcher";
import type {
  DeckGraphConnection,
  DeckGraphConnectionPayload,
  DeckGraphNode,
  DeckGraphNodePayload,
  DeckStatus,
} from "./types";

export type ReqUpdateDeckGraph = {
  path: {
    deckId: number;
  };
  body: {
    nodes: DeckGraphNodePayload[];
    connections: DeckGraphConnectionPayload[];
  };
};

export type ResUpdateDeckGraph = {
  id: number;
  status: DeckStatus;
  updatedAt: string;
  nodes: DeckGraphNode[];
  connections: DeckGraphConnection[];
};

export const updateDeckGraph = async (req: ReqUpdateDeckGraph) => {
  const result = await fetcher.put<ResUpdateDeckGraph>(
    `/decks/${req.path.deckId}/graph`,
    req.body
  );
  return result.data;
};

