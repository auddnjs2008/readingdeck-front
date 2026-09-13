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
    <section id="jump-back-in" className="flex scroll-mt-20 flex-col">
      <div className="flex items-end justify-between gap-4 pb-4">
        <div className="flex flex-col">
          <h2 className="font-serif text-2xl font-semibold leading-tight">
            최근 기록한 책
          </h2>
          <p className="mt-1 text-sm text-[#77726b] dark:text-[#aaa49b]">
            최근 카드 활동이 있었던 책이에요.
          </p>
        </div>
        {hasBooks && (
          <Button
            as={Link}
            href="/books/library"
            variant="ghost"
            size="sm"
            className="h-auto shrink-0 rounded-none px-0 text-[#a45138] underline-offset-4 hover:bg-transparent hover:underline dark:text-[#d77b5e]"
          >
            전체 보기
          </Button>
        )}
      </div>
      {hasBooks ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 border-t border-[#d8d4cc] pt-5 md:grid-cols-4 dark:border-[#4b4842]">
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
