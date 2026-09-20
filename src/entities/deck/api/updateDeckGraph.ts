import fetcher from "@/shared/api/fetcher";
import type {
  DeckGraphConnection,
  DeckGraphConnectionPayload,
  DeckGraphNode,
  DeckGraphNodePayload,
  DeckStatus,
} from "@/entities/deck/model/types";

export type ReqUpdateDeckGraph = {
  path: {
    deckId: number;
  };
  body: {
    expectedVersion: number;
    nodes: DeckGraphNodePayload[];
    connections: DeckGraphConnectionPayload[];
  };
};

export type ResUpdateDeckGraph = {
  version: number;
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
