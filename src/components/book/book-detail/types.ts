export type BookDetailSidebarInfo = {
  title: string;
  author: string;
  year?: string;
  coverUrl?: string | null;
  statusLabel?: string;
  status?: "reading" | "finished" | "paused";
  progressPercent?: number;
  currentPage?: number | null;
  totalPages?: number | null;
  startedAt?: string | null;
  finishedAt?: string | null;
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
  title?: string | null;
  quote?: string;
  thought: string;
  backgroundImage?: string;
  pageStart: number | null;
  pageEnd: number | null;
};
