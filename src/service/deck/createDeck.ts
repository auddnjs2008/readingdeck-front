import fetcher from "../fetcher";
import type {
  DeckBase,
  DeckGraphConnection,
  DeckGraphConnectionPayload,
  DeckGraphNode,
  DeckGraphNodePayload,
  DeckMode,
  DeckStatus,
} from "./types";

export type ReqCreateDeck = {
  body: {
    name?: string;
    description?: string;
    status?: DeckStatus;
    mode?: DeckMode;
    nodes?: DeckGraphNodePayload[];
    connections?: DeckGraphConnectionPayload[];
  };
};

export type ResCreateDeck = DeckBase & {
  nodes: DeckGraphNode[];
  connections: DeckGraphConnection[];
};

export const createDeck = async (req: ReqCreateDeck) => {
  const result = await fetcher.post<ResCreateDeck>("/decks", req.body);
  return result.data;
};
