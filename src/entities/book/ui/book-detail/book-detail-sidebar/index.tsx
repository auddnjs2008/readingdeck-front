import dayjs from "dayjs";

import { getBookDetailServer } from "@/entities/book/api/getBookDetail.server";
import type { ResGetBookDetail } from "@/entities/book/api/getBookDetail";
import type { BookDetailSidebarInfo } from "../types";
import BookDetailBackLink from "../book-detail-back-link";
import BookDetailCover from "../book-detail-cover";
import BookDetailMeta from "../book-detail-meta";
import BookDetailProgress from "../book-detail-progress";
import { BookDetailActions } from "../book-detail-actions";

type BookStatus = "reading" | "finished" | "paused";

const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  reading: "읽는 중",
  finished: "완독",
  paused: "중단",
};

function mapBookDetailToSidebarInfo(
  data: ResGetBookDetail
): BookDetailSidebarInfo {
  return {
    title: data.title,
    author: data.author,
    coverUrl: data.backgroundImage ?? undefined,
    year: data.createdAt
      ? dayjs(data.createdAt).format("YYYY-MM-DD")
      : undefined,
    status: data.status,
    statusLabel: BOOK_STATUS_LABEL[data.status],
    progressPercent: data.progressPercent,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    startedAt: data.startedAt
      ? dayjs(data.startedAt).format("YYYY-MM-DD")
      : null,
    finishedAt: data.finishedAt
      ? dayjs(data.finishedAt).format("YYYY-MM-DD")
      : null,
    rating: undefined,
  };
}

type BookDetailSidebarProps = {
  bookId: number;
};

export default async function BookDetailSidebar({
  bookId,
}: BookDetailSidebarProps) {
  if (!Number.isFinite(bookId) || bookId <= 0) {
    return (
      <aside className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:max-w-none lg:w-[320px]">
        <div className="sticky top-24 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/30 p-6">
            <p className="text-sm text-destructive">
              잘못된 책 주소입니다.
            </p>
          </div>
          <BookDetailBackLink />
        </div>
      </aside>
    );
  }

  const data = await getBookDetailServer({ path: { bookId } });
  const book = mapBookDetailToSidebarInfo(data);

  return (
    <aside
      className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:max-w-none lg:w-[320px]"
      data-book-id={bookId}
    >
      <div className="sticky top-24 flex flex-col gap-8">
        <BookDetailCover coverUrl={book.coverUrl} title={book.title} />
        <BookDetailMeta
          title={book.title}
          author={book.author}
          year={book.year}
          rating={book.rating}
        />
        <BookDetailProgress
          statusLabel={book.statusLabel}
          progressPercent={book.progressPercent}
          currentPage={book.currentPage}
          totalPages={book.totalPages}
          startedAt={book.startedAt}
          finishedAt={book.finishedAt}
        />
        <BookDetailActions
          bookId={bookId}
          book={{
            status: data.status,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            updatedAt: data.updatedAt,
          }}
        />
        <BookDetailBackLink />
      </div>
    </aside>
  );
}

export function BookDetailSidebarSkeleton() {
  return (
    <aside className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:max-w-none lg:w-[320px]">
      <div className="sticky top-24 flex flex-col gap-8">
        <div className="mx-auto aspect-2/3 w-full max-w-[108px] animate-pulse rounded-xl bg-muted sm:max-w-[144px] md:max-w-[180px] lg:max-w-none" />
        <div className="flex flex-col gap-2">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-30 animate-pulse rounded-xl bg-muted" />
        <BookDetailBackLink />
      </div>
    </aside>
  );
}
