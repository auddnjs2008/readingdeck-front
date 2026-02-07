"use client";
import { Library } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LargeBookCard from "../../large-book-card";
import { useBooksQuery } from "@/hooks/book/react-query/useBooksQuery";
import { CreateBookModal } from "../../create-book-modal";

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

  const hasBooks = data?.items && data.items.length > 0;

  return (
    <section id="jump-back-in" className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2 pt-4">
        <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground">
          Jump Back In
        </h2>
        {hasBooks && (
          <Button variant="ghost" size="sm" className="px-0 text-primary">
            View All
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
        <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center animate-in fade-in-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-sm">
            <Library className="h-8 w-8 text-muted-foreground/70" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              아직 읽기 시작한 책이 없어요
            </h3>
            <p className="text-sm text-muted-foreground">
              서재가 비어있습니다. 첫 번째 책을 추가하고 독서를 시작해보세요.
            </p>
          </div>
          <div className="mt-2">
            <CreateBookModal
              triggerLabel="첫 번째 책 추가하기"
              triggerClassName="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            />
          </div>
        </div>
      )}
    </section>
  );
}
