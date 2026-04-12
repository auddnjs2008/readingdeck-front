import type { Book } from "@/type/book";
import fetcher from "../fetcher";

export type ReqCreateBookCard = {
  path: {
    bookId: number;
  };
  body: {
    type: "insight" | "change" | "action" | "question";
    title?: string;
    thought: string;
    quote?: string;
    pageStart?: number;
    pageEnd?: number;
  };
};

export type ResCreateBookCard = {
  id: number;
  type: "insight" | "change" | "action" | "question";
  title: string | null;
  quote: string | null;
  thought: string;
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  pageStart: number | null;
  pageEnd: number | null;
  book: Pick<Book, "id" | "title" | "author" | "publisher">;
};

export const createBookCard = async (req: ReqCreateBookCard) => {
  const { data } = await fetcher.post<ResCreateBookCard>(
    `/books/${req.path.bookId}/cards`,
    req.body
  );
  return data;
};
