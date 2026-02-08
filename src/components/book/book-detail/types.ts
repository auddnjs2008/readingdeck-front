export type BookDetailSidebarInfo = {
  title: string;
  author: string;
  year?: string;
  coverUrl?: string | null;
  statusLabel?: string;
  progressPercent?: number;
  readAt?: string;
  rating?: number;
};

export type BookDetailCardType =
  | "insight"
  | "question"
  | "change"
  | "quote"
  | "action";

export type BookDetailCardItem = {
  id: number;
  type: BookDetailCardType;
  quote?: string;
  thought: string;
  backgroundImage?: string;
};
