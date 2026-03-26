import fetcher from "../fetcher";
import type { DeckMode, DeckStatus } from "./types";

export type DeckPreviewNode = {
  x: number;
  y: number;
  t: "book" | "card";
};

export type DeckPreviewEdge = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
};

export type DeckGraphPreview = {
  version: 1;
  kind: "graph";
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  nodeCount: number;
  connectionCount: number;
  nodes: DeckPreviewNode[];
  edges: DeckPreviewEdge[];
};

export type DeckListPreviewItem = {
  t: "insight" | "change" | "action" | "question" | "quote";
  title: string;
  cover?: string | null;
  book?: string | null;
};

export type DeckListPreview = {
  version: 1;
  kind: "list";
  itemCount: number;
  items: DeckListPreviewItem[];
};

export type DeckPreview = DeckGraphPreview | DeckListPreview;

export type ReqGetDecks = {
  query?: {
    take?: number;
    cursor?: number;
    status?: DeckStatus;
    mode?: DeckMode;
    keyword?: string;
    shared?: boolean;
    sort?: "latest" | "oldest";
  };
};

export type ResGetDecks = {
  items: {
    id: number;
    name: string;
    description: string | null;
    status: DeckStatus;
    mode: DeckMode;
    isShared: boolean;
    createdAt: string;
    updatedAt: string;
    preview: DeckPreview | null;
    previewUpdatedAt: string | null;
    nodeCount: number;
    connectionCount: number;
  }[];
  meta: {
    total: number;
    take: number;
    cursor: number;
    nextCursor: number | null;
  };
};

export const getDecks = async (req?: ReqGetDecks) => {
  const result = await fetcher.get<ResGetDecks>("/decks", {
    params: req?.query,
  });
  return result.data;
};
