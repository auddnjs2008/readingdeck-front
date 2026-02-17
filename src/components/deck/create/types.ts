import type { Edge, Node } from "@xyflow/react";

export type BookNodeData = {
  title: string;
  author: string;
  cover: string;
  onDeleteNode?: (nodeId: string) => void;
};

export type CardNodeData = {
  cardId?: number;
  kind: "Insight" | "Change" | "Action" | "Question" | "Quote";
  thought: string;
  quote?: string;
  meta?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  tags?: string[];
  highlighted?: boolean;
  onDeleteNode?: (nodeId: string) => void;
};

export type DeckFlowNode =
  | Node<BookNodeData, "book">
  | Node<CardNodeData, "card">;

export type DeckFlowEdge = Edge;

export type DeckSidebarBookItem = {
  id: string;
  title: string;
  author: string;
  cards: number;
  cover: string;
};

export type DeckSidebarCardItem = {
  id: string;
  type: "insight" | "change" | "action" | "question" | "quote";
  text: string;
  quote?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  used: boolean;
};
