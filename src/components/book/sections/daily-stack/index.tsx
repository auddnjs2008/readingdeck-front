"use client";

import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ThoughtCard from "@/components/card/thought-card";
import { useTodayCardsQuery } from "@/hooks/card/react-query/useTodayCardsQuery";
import type { Card } from "@/type/card";
import type { ResGetTodayCardsItem } from "@/service/card/getTodayCards";
import { CreateBookModal } from "../../create-book-modal";

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

  const hasCards = data && data.length > 0;

  const scrollToJumpBackIn = () => {
    document.getElementById("jump-back-in")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[32px]">
          Your Daily Stack
        </h1>
        <div className="hidden sm:flex">
          <CreateBookModal triggerLabel="Add New Book" />
        </div>
      </div>
      {isPending ? (
        <DailyStackSkeleton />
      ) : hasCards ? (
        <div className="hide-scrollbar -mx-4 flex overflow-x-auto pb-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-full items-stretch gap-4 md:gap-6">
            {data?.map((card: ResGetTodayCardsItem) => (
              <ThoughtCard
                key={card.id}
                card={{ ...card, book: { ...card.book, cardCount: 0 } } as Card}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center animate-in fade-in-50">
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
