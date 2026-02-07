"use client";

import LibraryBookGrid from "@/components/book/library/library-book-grid";
import LibraryPagination from "@/components/book/library/library-pagination";
import type { LibraryBook } from "@/components/book/library/types";
import { useBooksQuery } from "@/hooks/book/react-query/useBooksQuery";
import { useSearchParams } from "next/navigation";
import type { ReqGetBooks } from "@/service/book/getBooks";

const TAKE = 12;
const DEFAULT_SORT: NonNullable<ReqGetBooks["query"]>["sort"] = "createdAt";

function mapBooksToLibraryBooks(
  items: {
    id: number;
    title: string;
    author: string;
    cardCount: number;
    backgroundImage?: string | null;
  }[]
): LibraryBook[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author,
    cardsCount: item.cardCount,
    backgroundImage: item.backgroundImage ?? undefined,
  }));
}

export default function LibraryBookList() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const rawSort = searchParams.get("sort");
  const sort: NonNullable<ReqGetBooks["query"]>["sort"] =
    rawSort === "recentCard" || rawSort === "mostCards" ? rawSort : DEFAULT_SORT;
  const keyword = searchParams.get("keyword") ?? "";

  const { data: booksData, isPending } = useBooksQuery({
    query: {
      page,
      take: TAKE,
      keyword: keyword || undefined,
      sort,
    },
  });

  const books = booksData?.items
    ? mapBooksToLibraryBooks(booksData.items)
    : [];
  const totalPages = booksData?.meta?.totalPages ?? 1;

  return (
    <>
      <div className="min-h-104">
        {isPending ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: TAKE }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-lg bg-background animate-pulse"
              >
                <div className="aspect-2/3 w-full rounded-lg bg-muted" />
                <div className="h-5 w-4/5 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="mt-2 h-6 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <LibraryBookGrid books={books} />
        )}
      </div>
      {!isPending && totalPages > 0 && (
        <LibraryPagination currentPage={page} totalPages={totalPages} />
      )}
    </>
  );
}
