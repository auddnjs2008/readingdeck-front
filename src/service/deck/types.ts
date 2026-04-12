export type DeckStatus = "draft" | "published";
export type DeckMode = "list" | "graph";
export type DeckNodeType = "book" | "card";
export type DeckCardType = "insight" | "change" | "action" | "question";

export type DeckGraphNodePayload = {
  id?: number;
  clientKey?: string;
  type: DeckNodeType;
  bookId?: number;
  cardId?: number;
  positionX: number;
  positionY: number;
  order?: number;
};

export type DeckGraphConnectionPayload = {
  id?: number;
  fromNodeId?: number;
  toNodeId?: number;
  fromNodeClientKey?: string;
  toNodeClientKey?: string;
  type?: string | null;
  style?: { stroke?: string; strokeWidth?: number } | null;
  animated?: boolean;
  markerEnd?: { type?: string } | null;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string | null;
};

export type DeckGraphNode = {
  id: number;
  clientKey: string | null;
  type: DeckNodeType;
  bookId: number | null;
  cardId: number | null;
  book?: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    backgroundImage: string | null;
    createdAt: string;
    updatedAt: string;
    version: number;
  } | null;
  card?: {
    id: number;
    type: DeckCardType;
    title: string | null;
    quote: string | null;
    thought: string;
    backgroundImage: string | null;
    pageStart: number | null;
    pageEnd: number | null;
    createdAt: string;
    updatedAt: string;
    version: number;
  } | null;
  positionX: number;
  positionY: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type DeckGraphConnection = {
  id: number;
  deckId: number;
  fromNodeId: number;
  toNodeId: number;
  type: string | null;
  style: { stroke?: string; strokeWidth?: number } | null;
  animated: boolean;
  markerEnd: { type?: string } | null;
  sourceHandle: string | null;
  targetHandle: string | null;
  label: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type DeckBase = {
  id: number;
  name: string;
  description: string | null;
  userId: number;
  status: DeckStatus;
  mode: DeckMode;
  createdAt: string;
  updatedAt: string;
  version: number;
};
