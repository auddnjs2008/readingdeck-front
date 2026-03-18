"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LargeBookCard from "../../large-book-card";
import { useMyHomeSummaryQuery } from "@/hooks/me/react-query/useMyHomeSummaryQuery";
import { useRouter } from "next/navigation";
import EmptyBookState from "../../empty-book-state";

function JumpBackInSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 md:gap-4"
          data-skeleton-card
        >
          <Skeleton className="aspect-2/3 w-full rounded-lg md:aspect-3/4" />
          <div className="flex flex-col gap-2 pl-3 pb-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-3 w-8 rounded-md" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JumpBackInSection() {
  const { data, isPending, isError } = useMyHomeSummaryQuery();
  const router = useRouter();
  const books = data?.recentRecordedBooks ?? [];
  const hasBooks = books.length > 0;

  if (isError) {
    return null;
  }

  const handleViewAllClick = () => {
    router.push("/books/library");
  };

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
            onClick={handleViewAllClick}
            variant="ghost"
            size="sm"
            className="mt-1 shrink-0 px-0 text-primary"
          >
            전체 보기
          </Button>
        )}
      </div>
      {isPending ? (
        <JumpBackInSkeleton />
      ) : hasBooks ? (
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
