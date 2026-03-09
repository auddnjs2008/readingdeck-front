"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LargeBookCard from "../../large-book-card";
import { useBooksQuery } from "@/hooks/book/react-query/useBooksQuery";
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
  const { data, isPending } = useBooksQuery({
    query: { page: 1, take: 4, sort: "recentCard" },
  });
  const router = useRouter();
  const hasBooks = data?.items && data.items.length > 0;

  const handleViewAllClick = () => {
    router.push("/books/library");
  };

  return (
    <section id="jump-back-in" className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2 pt-4">
        <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground font-serif">
          최근 읽은 책
        </h2>
        {hasBooks && (
          <Button
            onClick={handleViewAllClick}
            variant="ghost"
            size="sm"
            className="px-0 text-primary"
          >
            전체 보기
          </Button>
        )}
      </div>
      {isPending ? (
        <JumpBackInSkeleton />
      ) : hasBooks ? (
        <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
          {data.items.map((book) => (
            <LargeBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyBookState
          title="아직 읽기 시작한 책이 없어요"
          description="서재가 비어있습니다. 첫 번째 책을 추가하고 독서를 시작해보세요."
        />
      )}
    </section>
  );
}
