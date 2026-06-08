import type { ReqGetBookCards } from "@/entities/book/api/getBookCards";
import type { ReqGetBookSearch } from "@/entities/book/api/getBookSearch";
import type { ReqGetBooks } from "@/entities/book/api/getBooks";

export const RQbookQueryKey = {
  all: ["book"] as const,
  list: (req?: ReqGetBooks) =>
    [...RQbookQueryKey.all, "list", req?.query ?? {}] as const,
  search: (query: ReqGetBookSearch["query"]) =>
    [...RQbookQueryKey.all, "search", query] as const,
  detail: (bookId: number) =>
    [...RQbookQueryKey.all, "detail", bookId] as const,
  cards: (bookId: number, query?: ReqGetBookCards["query"]) =>
    [...RQbookQueryKey.all, "cards", bookId, query ?? {}] as const,
};
