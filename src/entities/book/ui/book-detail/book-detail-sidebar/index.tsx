"use client";

import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getBookDetail } from "@/entities/book/api/getBookDetail";
import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";
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

export default function BookDetailSidebar() {
  const params = useParams<{ id: string }>();
  const bookId = Number(params.id);
  const validId = Number.isSafeInteger(bookId) && bookId > 0;
  const { data, isPending, isError, error } = useQuery({
    queryKey: RQbookQueryKey.detail(bookId),
    queryFn: () => getBookDetail({ path: { bookId } }),
    enabled: validId,
    throwOnError: true,
  });
  if (!validId) {
    return (
      <aside className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:w-[280px]">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="border-y border-black/10 py-5 dark:border-white/10">
            <p className="text-sm text-destructive">잘못된 책 주소입니다.</p>
          </div>
          <BookDetailBackLink />
        </div>
      </aside>
    );
  }

  if (isError) throw error;
  if (isPending) return <BookDetailSidebarSkeleton />;
  const book = mapBookDetailToSidebarInfo(data);

  return (
    <aside
      className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:w-[280px]"
      data-book-id={bookId}
    >
      <div className="flex flex-col gap-7 lg:sticky lg:top-24">
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
    <aside className="mx-auto w-full max-w-[420px] shrink-0 lg:mx-0 lg:w-[280px]">
      <div className="flex flex-col gap-7 lg:sticky lg:top-24">
        <div className="mx-auto aspect-2/3 w-full max-w-[180px] animate-pulse bg-black/5 dark:bg-white/10 lg:max-w-none" />
        <div className="flex flex-col gap-2">
          <div className="h-8 w-3/4 animate-pulse bg-black/5 dark:bg-white/10" />
          <div className="h-5 w-1/2 animate-pulse bg-black/5 dark:bg-white/10" />
        </div>
        <div className="space-y-4 border-y border-black/10 py-5 dark:border-white/10">
          <div className="h-4 w-24 animate-pulse bg-black/5 dark:bg-white/10" />
          <div className="h-1.5 w-full animate-pulse bg-black/5 dark:bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse bg-black/5 dark:bg-white/10" />
        </div>
        <BookDetailBackLink />
      </div>
    </aside>
  );
}
