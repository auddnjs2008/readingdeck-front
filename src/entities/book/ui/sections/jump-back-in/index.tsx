"use client";

import Link from "next/link";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { Button } from "@/shared/ui/button";
import LargeBookCard from "../../large-book-card";
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
    <section id="jump-back-in" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 px-2 pt-4">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground font-serif">
            최근 기록한 책
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            최근 카드 활동이 있었던 책이에요.
          </p>
        </div>
        {hasBooks && (
          <Button
            as={Link}
            href="/books/library"
            variant="ghost"
            size="sm"
            className="mt-1 shrink-0 px-0 text-primary"
          >
            전체 보기
          </Button>
        )}
      </div>
      {hasBooks ? (
        <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <LargeBookCard key={book.id} book={book} />
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
