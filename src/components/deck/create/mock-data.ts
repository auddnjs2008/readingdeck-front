import type { DeckFlowEdge, DeckFlowNode } from "./types";

export const initialNodes: DeckFlowNode[] = [
  {
    id: "book-1",
    type: "book",
    position: { x: 120, y: 200 },
    data: {
      title: "Atomic Habits",
      author: "James Clear",
      cover:
        "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=1200&auto=format&fit=crop",
    },
  },
  {
    id: "card-1",
    type: "card",
    position: { x: 560, y: 120 },
    data: {
      kind: "Concept",
      quote:
        '"You do not rise to the level of your goals. You fall to the level of your systems."',
      meta: "Page 27",
    },
  },
  {
    id: "card-2",
    type: "card",
    position: { x: 560, y: 360 },
    data: {
      kind: "Action",
      quote:
        "Identity-based habits focus on who you wish to become, not just what you want to achieve.",
      meta: "#identity #psychology",
      highlighted: true,
    },
  },
];

export const initialEdges: DeckFlowEdge[] = [
  {
    id: "book-1-card-1",
    source: "book-1",
    target: "card-1",
    type: "smoothstep",
    style: {
      stroke: "color-mix(in oklab, var(--muted-foreground) 40%, transparent)",
    },
  },
  {
    id: "book-1-card-2",
    source: "book-1",
    target: "card-2",
    type: "smoothstep",
    style: { stroke: "var(--primary)", strokeWidth: 2.5 },
  },
];

export const libraryItems = [
  {
    id: "b1",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cards: 12,
  },
  { id: "b2", title: "Deep Work", author: "Cal Newport", cards: 8 },
  {
    id: "b3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cards: 24,
  },
  { id: "b4", title: "Antifragile", author: "Nassim Taleb", cards: 15 },
] as const;

