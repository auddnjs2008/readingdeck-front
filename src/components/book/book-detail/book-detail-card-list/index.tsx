"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  CardFilter,
  type CardFilterProps,
} from "@/components/card/card-fiilter";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import BookDetailCard from "../book-detail-card";
import type { BookDetailCardItem } from "../types";

type Props = {
  cards: BookDetailCardItem[];
  isPending: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  filterProps: CardFilterProps;
};

function CardListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-6 rounded-xl border border-border bg-card/80 p-8"
        >
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-4/5 rounded-md" />
          <Skeleton className="mt-4 h-4 w-24 rounded-md" />
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          아직 만든 카드가 없어요
        </h3>
        <p className="text-sm text-muted-foreground">
          이 책에서 인상적인 문장이나 생각을 카드로 남겨보세요.
        </p>
      </div>
    </div>
  );
}

export default function BookDetailCardList({
  cards,
  isPending,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  filterProps,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) return;
      onLoadMore();
    },
    [hasNextPage, isFetchingNextPage, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const showSkeleton = isPending && cards.length === 0;
  const showEmpty = !isPending && cards.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <CardFilter {...filterProps} />
      {showSkeleton && <CardListSkeleton />}
      {showEmpty && <EmptyState />}
      {!showSkeleton && !showEmpty && (
        <>
          {cards.map((card) => (
            <BookDetailCard key={card.id} card={card} />
          ))}
          <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                더 불러오는 중...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
