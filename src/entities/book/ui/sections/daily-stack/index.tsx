"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  // Keep this reading session stable when revisits refresh the recommendations.
  const [readingStack, setReadingStack] = useState<CardStackItem[] | null>(null);
  const stackItems = readingStack ?? homeSummary.revisitCards;
  const cardCount = stackItems.length;
  const hasCards = cardCount > 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

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
    setReadingStack(stackItems);

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
    <section className="flex flex-col">
      <p className="mb-2 text-[10px] font-medium text-[#77726b] dark:text-[#aaa49b]">
        TODAY&apos;S CARD
      </p>
      <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-serif text-[28px] font-semibold leading-tight md:text-[32px]">
          오늘의 카드 스택
        </h1>
        <div className="flex items-center gap-3">
          {hasCards && cardCount > 1 && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-[4px] border-[#aaa59d] text-[#77726b] hover:bg-transparent hover:text-[#292724] dark:border-[#625e57] dark:text-[#aaa49b] dark:hover:text-[#ebe7df]"
                onClick={scrollPrev}
                aria-label="이전 카드"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-[4px] border-[#aaa59d] text-[#77726b] hover:bg-transparent hover:text-[#292724] dark:border-[#625e57] dark:text-[#aaa49b] dark:hover:text-[#ebe7df]"
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
              triggerClassName="h-9 rounded-[4px] border-[#aaa59d] bg-transparent px-4 text-[#292724] hover:bg-transparent dark:border-[#625e57] dark:text-[#ebe7df]"
            />
          </div>
        </div>
      </div>
      {hasCards ? (
        <div className="embla border-y border-[#d8d4cc] py-7 dark:border-[#4b4842]">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {stackItems.map((card) => (
                <div className="embla__slide" key={card.id}>
                  <div className="flex h-full min-h-0 flex-1 flex-col">
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
                      cardClassName="flex h-full max-w-none flex-col"
                      onClick={() => {
                        router.push(`/cards/${card.id}`);
                        handleRevisit(card);
                      }}
                    />
                    <Button variant="outline" className="mt-4 self-start" onClick={() => {
                      router.push(`/cards/${card.id}?mode=reflect`);
                      handleRevisit(card);
                    }}>지금의 생각 남기기</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[260px] w-full flex-col items-center justify-center gap-4 border-y border-[#d8d4cc] px-4 text-center dark:border-[#4b4842]">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold">
              다시 볼 카드가 없어요
            </h3>
            <p className="text-sm text-[#77726b] dark:text-[#aaa49b]">
              카드가 쌓이면 오래 안 본 카드부터 이곳에 다시 보여드릴게요.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-2 rounded-[4px] border-[#aaa59d] bg-transparent dark:border-[#625e57]"
            onClick={scrollToJumpBackIn}
          >
            아래에서 책 고르기
          </Button>
        </div>
      )}
    </section>
  );
}
