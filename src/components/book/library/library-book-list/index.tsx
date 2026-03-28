"use client";

import EmptyBookState from "@/components/book/empty-book-state";
import LibraryBookGrid from "@/components/book/library/library-book-grid";
import LibraryPagination from "@/components/book/library/library-pagination";
import type { LibraryBook } from "@/components/book/library/types";
import { useBooksQuery } from "@/hooks/book/react-query/useBooksQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
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

  const { data: booksData, isPending } = useBooksQuery({
    query: {
      page,
      take: TAKE,
      keyword: keyword || undefined,
      sort,
      status,
    },
  });

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
  const emptyDescription = status
    ? "다른 상태를 보거나 전체 서재로 돌아가서 책 흐름을 확인해보세요."
    : "검색어나 필터를 조정하면 다른 책을 볼 수 있어요.";

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
        ) : hasBooks ? (
          <LibraryBookGrid books={books} />
        ) : (
          <>
            {hasActiveFilters ? (
              <div className="flex min-h-[360px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/70 bg-muted/50 px-4 text-center animate-in fade-in-50">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {emptyTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {emptyDescription}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(pathname)}
                  className="rounded-full px-4"
                >
                  전체 보기
                </Button>
              </div>
            ) : (
              <EmptyBookState
                title="서재가 아직 비어 있어요"
                description="첫 번째 책을 추가해서 나만의 독서 기록을 쌓아보세요."
                triggerLabel="책 추가하기"
                className="min-h-[360px]"
              />
            )}
          </>
        )}
      </div>
      {!isPending && hasBooks && totalPages > 0 && (
        <LibraryPagination currentPage={page} totalPages={totalPages} />
      )}
    </>
  );
}
