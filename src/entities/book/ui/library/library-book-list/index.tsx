"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import EmptyBookState from "@/entities/book/ui/empty-book-state";
import { useBooksQuery } from "@/entities/book/model/queries/useBooksQuery";
import LibraryBookGrid from "@/entities/book/ui/library/library-book-grid";
import LibraryPagination from "@/entities/book/ui/library/library-pagination";
import type { LibraryBook } from "@/entities/book/ui/library/types";
import { Button } from "@/shared/ui/button";
import type { ReqGetBooks } from "@/entities/book/api/getBooks";

const TAKE = 12;
const DEFAULT_SORT: NonNullable<ReqGetBooks["query"]>["sort"] = "createdAt";

function mapBooksToLibraryBooks(
  items: {
    id: number;
    title: string;
    author: string;
    cardCount: number;
    backgroundImage?: string | null;
    status: "reading" | "finished" | "paused";
  }[]
): LibraryBook[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author,
    cardsCount: item.cardCount,
    backgroundImage: item.backgroundImage ?? undefined,
    status: item.status,
  }));
}

export default function LibraryBookList() {
  const searchParams = useSearchParams();
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawSort = searchParams.get("sort");
  const sort: NonNullable<ReqGetBooks["query"]>["sort"] =
    rawSort === "recentCard" || rawSort === "mostCards" ? rawSort : DEFAULT_SORT;
  const keyword = searchParams.get("keyword") ?? "";
  const rawStatus = searchParams.get("status");
  const status: NonNullable<ReqGetBooks["query"]>["status"] | undefined =
    rawStatus === "reading" || rawStatus === "finished" || rawStatus === "paused"
      ? rawStatus
      : undefined;
  const hasActiveFilters = Boolean(keyword || status);

  const { data: booksData, isPending, isError, error } = useBooksQuery({
    query: {
      page,
      take: TAKE,
      keyword: keyword || undefined,
      sort,
      status,
    },
  });

  if (isError) throw error;
  if (isPending) return <LibraryBookListSkeleton />;

  const books = booksData?.items
    ? mapBooksToLibraryBooks(booksData.items)
    : [];
  const hasBooks = books.length > 0;
  const totalPages = booksData?.meta?.totalPages ?? 1;
  const emptyTitle = status
    ? {
        reading: "읽는 중인 책이 아직 없어요",
        finished: "완독한 책이 아직 없어요",
        paused: "중단한 책이 아직 없어요",
      }[status]
    : "조건에 맞는 책이 없어요";

  return (
    <>
      <div className="min-h-104">
        {hasBooks ? (
          <LibraryBookGrid books={books} />
        ) : (
          <>
            {hasActiveFilters ? (
              <div role="status" className="flex min-h-[320px] w-full flex-col items-center justify-center gap-5 px-4 text-center">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-foreground">
                    {emptyTitle}
                  </h3>
                </div>
                <Button
                  as={Link}
                  href="/books/library"
                  variant="ghost"
                  className="rounded-[6px]! px-4 text-primary"
                >
                  전체 보기
                </Button>
              </div>
            ) : (
              <EmptyBookState
                title="서재가 아직 비어 있어요"
                description=""
                triggerLabel="책 추가하기"
                className="min-h-[360px]"
              />
            )}
          </>
        )}
      </div>
      {hasBooks && totalPages > 1 && (
        <LibraryPagination currentPage={page} totalPages={totalPages} />
      )}
    </>
  );
}

export function LibraryBookListSkeleton() {
  return (
    <div aria-label="책 불러오는 중" aria-busy="true" className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {Array.from({ length: TAKE }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-3"
        >
          <div className="aspect-4/5 w-full rounded-[4px] bg-muted" />
          <div className="h-5 w-4/5 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="mt-2 h-6 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
