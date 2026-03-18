"use client";

import { useMyHomeSummaryQuery } from "@/hooks/me/react-query/useMyHomeSummaryQuery";
import LargeBookCard from "../../large-book-card";
import EmptyBookState from "../../empty-book-state";

export default function CurrentReadingSection() {
  const { data, isPending, isError } = useMyHomeSummaryQuery();

  const books = data?.currentReadingBooks ?? [];
  const hasBooks = books.length > 0;

  if (isError) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 px-2 pt-1">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground font-serif">
            지금 읽는 책
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            진행 중인 책의 상태를 관리하고 카드 작성을 이어가세요.
          </p>
        </div>
      </div>
      {isPending ? (
        <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-2/3 animate-pulse rounded-lg bg-muted/50 md:aspect-3/4"
            />
          ))}
        </div>
      ) : hasBooks ? (
        <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <LargeBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyBookState
          title="읽는 중인 책이 아직 없어요"
          description="책 상세에서 진행 상태를 업데이트하면 이곳에서 바로 이어서 관리할 수 있어요."
        />
      )}
    </section>
  );
}
