import type { Edge, Node } from "@xyflow/react";

export type BookNodeData = {
  title: string;
  author: string;
  cover: string;
  onDeleteNode?: (nodeId: string) => void;
};

export type CardNodeData = {
  kind: "Insight" | "Change" | "Question" | "Quote";
  thought: string;
  quote?: string;
  meta: string;
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
  type: "insight" | "change" | "question" | "quote";
  text: string;
  quote?: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  used: boolean;
};
