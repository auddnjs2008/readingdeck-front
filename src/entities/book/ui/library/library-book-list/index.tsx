import Link from "next/link";

import EmptyBookState from "@/entities/book/ui/empty-book-state";
import { getBooksServer } from "@/entities/book/api/getBooks.server";
import LibraryBookGrid from "@/entities/book/ui/library/library-book-grid";
import LibraryPagination from "@/entities/book/ui/library/library-pagination";
import type { LibraryBook } from "@/entities/book/ui/library/types";
import { Button } from "@/shared/ui/button";
import type { ReqGetBooks } from "@/entities/book/api/getBooks";

const TAKE = 12;
const DEFAULT_SORT: NonNullable<ReqGetBooks["query"]>["sort"] = "createdAt";

type LibrarySearchParams = Record<string, string | string[] | undefined>;

type Props = {
  searchParams?: LibrarySearchParams;
};

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

const getParam = (searchParams: LibrarySearchParams | undefined, key: string) => {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
};

export default async function LibraryBookList({ searchParams }: Props) {
  const page = Math.max(1, Number(getParam(searchParams, "page")) || 1);
  const rawSort = getParam(searchParams, "sort");
  const sort: NonNullable<ReqGetBooks["query"]>["sort"] =
    rawSort === "recentCard" || rawSort === "mostCards" ? rawSort : DEFAULT_SORT;
  const keyword = getParam(searchParams, "keyword") ?? "";
  const rawStatus = getParam(searchParams, "status");
  const status: NonNullable<ReqGetBooks["query"]>["status"] | undefined =
    rawStatus === "reading" || rawStatus === "finished" || rawStatus === "paused"
      ? rawStatus
      : undefined;
  const hasActiveFilters = Boolean(keyword || status);

  const booksData = await getBooksServer({
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
        {hasBooks ? (
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
                  as={Link}
                  href="/books/library"
                  variant="outline"
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
      {hasBooks && totalPages > 0 && (
        <LibraryPagination currentPage={page} totalPages={totalPages} />
      )}
    </>
  );
}

export function LibraryBookListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: TAKE }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-3 rounded-lg bg-background"
        >
          <div className="aspect-2/3 w-full rounded-lg bg-muted" />
          <div className="h-5 w-4/5 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="mt-2 h-6 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
