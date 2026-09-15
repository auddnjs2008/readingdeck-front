"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  CardFilter,
  type CardFilterProps,
} from "@/entities/card/ui/card-fiilter";
import { Skeleton } from "@/shared/ui/skeleton";
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
    <div aria-label="카드 목록 불러오는 중">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-border/70 py-5">
          <Skeleton className="mt-1 h-4 w-4 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-b border-border/70 py-14 text-center">
      <p className="text-base font-medium text-foreground">
        아직 만든 카드가 없어요
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        이 책에서 인상적인 문장이나 생각을 카드로 남겨보세요.
      </p>
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
    <div>
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
