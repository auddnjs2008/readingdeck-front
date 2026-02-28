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
      <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[32px]">
          오늘의 카드 스택
        </h1>
        <div className="flex items-center gap-3">
          {hasCards && cardCount > 1 && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                onClick={scrollPrev}
                aria-label="이전 카드"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                onClick={scrollNext}
                aria-label="다음 카드"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
          <div className="hidden sm:block">
            <CreateBookModal triggerLabel="새 책 추가" triggerVariant="outline" triggerClassName="h-9 rounded-full px-4 border-border/60 bg-transparent hover:bg-muted/50 text-foreground" />
          </div>
        </div>
      </div>
      {isPending ? (
        <DailyStackSkeleton />
      ) : hasCards ? (
        <div className="embla relative ">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {data?.map((card: ResGetTodayCardsItem) => (
                <div className="embla__slide" key={card.id}>
                  <div className="flex h-full min-h-0 flex-1 flex-col pb-3 px-1 pt-1">
                    <ThoughtCard
                      card={
                        {
                          ...card,
                          book: { ...card.book, cardCount: 0 },
                        } as Card
                      }
                      cardClassName="h-full w-full max-w-none flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(63,54,49,0.08)]"
                      onClick={() => {
                        window.location.href = `/books/${card.book.id}`;
                      }}
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
