import type { Edge, Node } from "@xyflow/react";

export type BookNodeData = {
  title: string;
  author: string;
  cover: string;
};

export type CardNodeData = {
  kind: "Concept" | "Action";
  quote: string;
  meta: string;
  highlighted?: boolean;
};

export type DeckFlowNode =
  | Node<BookNodeData, "book">
  | Node<CardNodeData, "card">;

export type DeckFlowEdge = Edge;

