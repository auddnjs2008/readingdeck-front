import type {
  DeckFlowEdge,
  DeckFlowNode,
  DeckSidebarBookItem,
  DeckSidebarCardItem,
} from "./types";

export const initialNodes: DeckFlowNode[] = [
  
];

export const initialEdges: DeckFlowEdge[] = [
  
];

export const libraryItems: readonly DeckSidebarBookItem[] = [
  {
    id: "b1",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cards: 12,
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "b2",
    title: "Deep Work",
    author: "Cal Newport",
    cards: 8,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "b3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cards: 24,
    cover:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "b4",
    title: "Antifragile",
    author: "Nassim Taleb",
    cards: 15,
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
  },
];

export const cardLibraryItems: readonly DeckSidebarCardItem[] = [
  {
    id: "c1",
    type: "insight",
    text: "Your habits are how you embody your identity. Every action is a vote for who you want to become.",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    bookCover:
      "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=1200&auto=format&fit=crop",
    used: false,
  },
  {
    id: "c2",
    type: "change",
    text: "Habits are the compound interest of self-improvement.",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    bookCover:
      "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=1200&auto=format&fit=crop",
    used: true,
  },
  {
    id: "c3",
    type: "quote",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    bookTitle: "The Nicomachean Ethics",
    bookAuthor: "Aristotle",
    bookCover:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
    used: false,
  },
  {
    id: "c4",
    type: "question",
    text: "The habit of saving is itself an education; it fosters order and self-denial.",
    bookTitle: "The Psychology of Money",
    bookAuthor: "Morgan Housel",
    bookCover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop",
    used: true,
  },
];
