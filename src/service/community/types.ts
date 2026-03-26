import type { DeckCardType, DeckMode } from "@/service/deck/types";
import type { DeckPreview } from "@/service/deck/getDecks";

export type CommunityPostAuthor = {
  id: number;
  name: string;
  profile: string | null;
};

export type CommunityPost = {
  id: number;
  deckId: number;
  caption: string | null;
  deckName: string;
  deckDescription: string | null;
  deckMode: DeckMode;
  preview: DeckPreview;
  primaryCardType: DeckCardType | null;
  primaryQuote: string | null;
  primaryThought: string;
  bookTitle: string | null;
  bookAuthor: string | null;
  createdAt: string;
  updatedAt: string;
  author: CommunityPostAuthor;
};

export type CommunityPostSnapshotNode = {
  id: number;
  type: "book" | "card";
  positionX: number;
  positionY: number;
  order: number;
  book: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    backgroundImage: string | null;
  } | null;
  card: {
    id: number;
    type: DeckCardType;
    quote: string | null;
    thought: string;
    backgroundImage: string | null;
    pageStart: number | null;
    pageEnd: number | null;
  } | null;
};

export type CommunityPostSnapshotConnection = {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  type: string | null;
  style: { stroke?: string; strokeWidth?: number } | null;
  animated: boolean;
  markerEnd: { type?: string } | null;
  sourceHandle: string | null;
  targetHandle: string | null;
  label: string | null;
};

export type CommunityPostDetail = CommunityPost & {
  snapshot: {
    version: 1;
    deck: {
      id: number;
      name: string;
      description: string | null;
      mode: DeckMode;
    };
    nodes: CommunityPostSnapshotNode[];
    connections: CommunityPostSnapshotConnection[];
  };
};

export type CommunityCommentAuthor = {
  id: number;
  name: string;
  profile: string | null;
};

export type CommunityComment = {
  id: number;
  postId: number;
  userId: number;
  parentId: number | null;
  content: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommunityCommentAuthor | null;
  replies: CommunityComment[];
};
