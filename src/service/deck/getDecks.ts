import fetcher from "../fetcher";
import type { DeckStatus } from "./types";

type DeckPreviewNode = {
  x: number;
  y: number;
  t: "book" | "card";
};

type DeckPreviewEdge = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
};

type DeckPreview = {
  version: 1;
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

export type ReqGetDecks = {
  query?: {
    take?: number;
    cursor?: number;
    status?: DeckStatus;
    keyword?: string;
    sort?: "latest" | "oldest";
  };
};

export type ResGetDecks = {
  items: {
    id: number;
    name: string;
    status: DeckStatus;
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
