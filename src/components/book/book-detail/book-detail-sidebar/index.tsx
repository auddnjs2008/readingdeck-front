"use client";

import dayjs from "dayjs";
import { useParams } from "next/navigation";

import { useBookDetailQuery } from "@/hooks/book/react-query/useBookDetailQuery";
import type { BookDetailSidebarInfo } from "../types";
import type { ResGetBookDetail } from "@/service/book/getBookDetail";
import BookDetailBackLink from "../book-detail-back-link";
import BookDetailCover from "../book-detail-cover";
import BookDetailMeta from "../book-detail-meta";
import BookDetailProgress from "../book-detail-progress";

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
    statusLabel: undefined,
    progressPercent: undefined,
    readAt: data.updatedAt
      ? dayjs(data.updatedAt).format("YYYY-MM-DD")
      : undefined,
    rating: undefined,
  };
}

export default function BookDetailSidebar() {
  const params = useParams();
  const bookId = params.id as string;
  const id = Number(bookId);

  const { data, isPending, isError } = useBookDetailQuery({
    path: { bookId: id },
  });

  const book: BookDetailSidebarInfo | null = data
    ? mapBookDetailToSidebarInfo(data)
    : null;

  if (isPending || isError || !book) {
    return (
      <aside className="w-full shrink-0 lg:w-[320px]" data-book-id={bookId}>
        <div className="sticky top-24 flex flex-col gap-8">
          <div className="aspect-2/3 w-full animate-pulse rounded-xl bg-muted" />
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

  return (
    <aside className="w-full shrink-0 lg:w-[320px]" data-book-id={bookId}>
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
          readAt={book.readAt}
        />
        <BookDetailBackLink />
      </div>
    </aside>
  );
}
