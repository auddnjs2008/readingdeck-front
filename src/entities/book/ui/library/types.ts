export type LibraryBook = {
  id: number;
  title: string;
  author: string;
  backgroundImage?: string;
  cardsCount: number;
  status?: "reading" | "finished" | "paused";
};
