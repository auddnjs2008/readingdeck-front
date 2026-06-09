"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { useCardRevisitMutation } from "@/entities/card/model/queries/useCardRevisitMutation";
import type { Card } from "@/entities/card/model/types";
import ThoughtCard from "@/entities/card/ui/thought-card2";
import { Button } from "@/shared/ui/button";
import { CreateBookModal } from "../../create-book-modal";

type CardStackItem = ResGetMyHomeSummary["revisitCards"][number];

type DailyStackSectionProps = {
  homeSummary: ResGetMyHomeSummary;
};

export default function DailyStackSection({
  homeSummary,
}: DailyStackSectionProps) {
  const router = useRouter();
  const revisitCardMutation = useCardRevisitMutation();
  const stackItems = homeSummary.revisitCards;
  const cardCount = stackItems.length;
  const hasCards = cardCount > 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    if (cardCount === 0) return;
    emblaApi.scrollTo(0);
  }, [cardCount, emblaApi]);

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

  const handleRevisit = (item: CardStackItem) => {
    if (!item) return;

    revisitCardMutation.mutate(
      { path: { cardId: item.id } },
      {
        onError: () => {
          toast.error("복습 기록 저장에 실패했습니다.");
        },
      }
    );
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
            <CreateBookModal
              triggerLabel="새 책 추가"
              triggerVariant="outline"
              triggerClassName="h-9 rounded-full px-4 border-border/60 bg-transparent hover:bg-muted/50 text-foreground"
            />
          </div>
        </div>
      </div>
      {hasCards ? (
        <div className="embla relative ">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {stackItems.map((card) => (
                <div className="embla__slide" key={card.id}>
                  <div className="flex h-full min-h-0 flex-1 flex-col pb-3 px-1 pt-1">
                    <ThoughtCard
                      card={
                        {
                          ...card,
                          revisitReason: card.reason,
                          revisitReasonLabel: card.reasonLabel,
                          book: {
                            ...card.book,
                            publisher: "",
                            cardCount: 0,
                          },
                        } as Card
                      }
                      cardClassName="h-full w-full max-w-none flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(63,54,49,0.08)]"
                      onClick={() => {
                        router.push(`/cards/${card.id}`);
                        handleRevisit(card);
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
              다시 볼 카드가 없어요
            </h3>
            <p className="text-sm text-muted-foreground">
              카드가 쌓이면 오래 안 본 카드부터 이곳에 다시 보여드릴게요.
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
