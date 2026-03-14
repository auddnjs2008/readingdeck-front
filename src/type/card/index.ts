import { Book } from "../book";

export type CardType = "insight" | "change" | "action" | "question";

export interface Card {
  id: number;
  type: CardType;
  quote?: string | null;
  thought: string;
  backgroundImage?: string | null;
  pageStart?: number | null;
  pageEnd?: number | null;
  // relations
  book?: Book;
  createdAt?: string;
  updatedAt?: string;
  lastRevisitedAt?: string | null;
  revisitCount?: number;
}
