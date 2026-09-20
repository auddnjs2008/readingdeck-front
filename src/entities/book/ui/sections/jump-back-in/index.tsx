"use client";

import Link from "next/link";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import EmptyBookState from "../../empty-book-state";

type JumpBackInSectionProps = {
  homeSummary: ResGetMyHomeSummary;
};

export default function JumpBackInSection({
  homeSummary,
}: JumpBackInSectionProps) {
  const books = homeSummary.recentRecordedBooks;
  const hasBooks = books.length > 0;

  return (
    <section id="jump-back-in" className="flex scroll-mt-20 flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="font-serif text-2xl font-semibold leading-tight">
            최근 기록한 책
          </h2>
          <p className="mt-1 text-sm text-[#77726b] dark:text-[#aaa49b]">
            최근 카드 활동이 있었던 책이에요.
          </p>
        </div>
        {hasBooks && (
          <Link
            href="/books/library"
            className="shrink-0 py-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            전체 보기
          </Link>
        )}
      </div>
      {hasBooks ? (
        <div>
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-5 transition-colors hover:bg-muted/40">
              <div className="min-w-0">
                <h3 className="truncate font-medium">{book.title}</h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">{book.author} · 카드 {book.cardCount}개</p>
              </div>
              <span aria-hidden="true" className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyBookState
          title="최근 기록한 책이 아직 없어요"
          description="카드를 남기기 시작하면 최근 활동이 있었던 책이 이곳에 보여요."
        />
      )}
    </section>
  );
}
