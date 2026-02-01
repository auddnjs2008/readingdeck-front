import type { ReqGetBookCards } from "@/service/book/getBookCards";
import type { ReqGetBookSearch } from "@/service/book/getBookSearch";
import type { ReqGetBooks } from "@/service/book/getBooks";

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
