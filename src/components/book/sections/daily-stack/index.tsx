"use client";

import { useCallback, useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useTodayCardsQuery } from "@/hooks/card/react-query/useTodayCardsQuery";
import type { Card } from "@/type/card";
import type { ResGetTodayCardsItem } from "@/service/card/getTodayCards";
import { CreateBookModal } from "../../create-book-modal";
import ThoughtCard from "@/components/card/thought-card2";
import useEmblaCarousel from "embla-carousel-react";

function DailyStackSkeleton() {
  return (
    <div className="hide-scrollbar -mx-4 flex overflow-x-auto pb-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-full items-stretch gap-4 md:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[280px] flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-0"
            data-skeleton-card
          >
            <Skeleton className="h-40 w-full rounded-t-xl rounded-b-none" />
            <div className="flex flex-1 flex-col gap-4 p-5 pt-1">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="mt-2 h-9 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DailyStackSection() {
  const { data, isPending } = useTodayCardsQuery({ query: { limit: 5 } });
  const cardCount = data?.length ?? 0;
  const hasCards = cardCount > 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // 자동 슬라이드 (5초마다 다음 카드로 이동)
  useEffect(() => {
    if (!emblaApi || !hasCards || cardCount <= 1) return;

    const intervalId = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [emblaApi, hasCards, cardCount]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi || cardCount <= 1) return;
    emblaApi.scrollPrev();
  }, [emblaApi, cardCount]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || cardCount <= 1) return;
    emblaApi.scrollNext();
  }, [emblaApi, cardCount]);

  const scrollToJumpBackIn = () => {
    document.getElementById("jump-back-in")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[32px] font-serif">
          오늘의 카드 스택
        </h1>
        <div className="hidden sm:flex">
          <CreateBookModal triggerLabel="새 책 추가" />
        </div>
      </div>
      {isPending ? (
        <DailyStackSkeleton />
      ) : hasCards ? (
        <div className="embla relative ">
          {cardCount > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-black/60 p-0 text-muted-foreground shadow-lg backdrop-blur-sm hover:bg-black/60 hover:text-foreground"
                onClick={scrollPrev}
                aria-label="이전 카드"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-black/40 p-0 text-muted-foreground shadow-lg backdrop-blur-sm hover:bg-black/60 hover:text-foreground"
                onClick={scrollNext}
                aria-label="다음 카드"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {data?.map((card: ResGetTodayCardsItem) => (
                <div className="embla__slide" key={card.id}>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <ThoughtCard
                      card={
                        {
                          ...card,
                          book: { ...card.book, cardCount: 0 },
                        } as Card
                      }
                      cardClassName="h-full w-full max-w-none flex flex-col"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/70 bg-muted/50 px-4 text-center animate-in fade-in-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-sm">
            <BookOpen className="h-8 w-8 text-muted-foreground/70" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              오늘 만든 카드가 없어요
            </h3>
            <p className="text-sm text-muted-foreground">
              읽고 있는 책에서 인상적인 문장을 카드로 남겨보세요.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-2"
            onClick={scrollToJumpBackIn}
          >
            아래에서 책 고르기
          </Button>
        </div>
      )}
    </section>
  );
}
