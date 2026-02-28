"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { ChevronLeft, ChevronRight, FileEdit, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDecksQuery } from "@/hooks/deck/react-query/useDecksQuery";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

function ActiveDraftsSkeleton() {
  return (
    <div className="hide-scrollbar -mx-4 flex overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-full items-stretch gap-4 md:gap-6">
        {/* Create New Deck Skeleton */}
        <div className="flex min-w-[280px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/60 p-5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Drafts Skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[280px] flex-1 flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActiveDraftsSection() {
  const router = useRouter();
  const activeDraftsQuery = useDecksQuery({
    query: {
      take: 8,
      status: "draft",
      sort: "latest",
    },
  });

  const activeDrafts = activeDraftsQuery.data?.items ?? [];
  const draftCount = activeDrafts.length;
  // +1 for the "Create New Deck" card
  const totalDraftItems = draftCount + 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (!emblaApi || totalDraftItems <= 1) return;
    emblaApi.scrollPrev();
  }, [emblaApi, totalDraftItems]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || totalDraftItems <= 1) return;
    emblaApi.scrollNext();
  }, [emblaApi, totalDraftItems]);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileEdit className="h-[18px] w-[18px] text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            작업 중인 덱
          </h2>
        </div>
        <div className="flex items-center gap-4">{/* View All removed */}</div>
      </div>

      {activeDraftsQuery.isPending ? (
        <ActiveDraftsSkeleton />
      ) : (
        <div className="embla relative group h-[190px]">
          {totalDraftItems > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 rounded-full border-border bg-background/80 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:text-foreground group-hover:opacity-100 md:flex"
                onClick={scrollPrev}
                aria-label="Previous draft"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 rounded-full border-border bg-background/80 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:text-foreground group-hover:opacity-100 md:flex"
                onClick={scrollNext}
                aria-label="Next draft"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}
          <div className="embla__viewport h-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {/* Create New Deck Slide */}
              <div className="embla__slide">
                <Link
                  href="/decks/create"
                  className="group flex h-[190px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/50 transition-all hover:border-primary/60 hover:bg-card"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className="text-lg font-medium">새 덱 만들기</span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    빈 덱에서 시작하기
                  </span>
                </Link>
              </div>

              {/* Active Drafts Slides */}
              {activeDrafts.map((deck) => (
                <div className="embla__slide" key={deck.id}>
                  <article
                    className="group flex h-[190px] w-full cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-[0_4px_12px_rgba(63,54,49,0.05)] transition-all hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(63,54,49,0.08)]"
                    onClick={() => router.push(`/decks/${deck.id}`)}
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                          작성 중
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-xl font-bold">
                        {deck.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        마지막 수정: {formatUpdatedAt(deck.updatedAt)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground">
                        {deck.nodeCount} 노드
                      </span>
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:text-primary/80"
                        onClick={() => router.push(`/decks/${deck.id}`)}
                      >
                        계속하기
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
