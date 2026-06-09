"use client";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { Skeleton } from "@/shared/ui/skeleton";
import { BooksColdStartHero } from "./books-cold-start-hero";
import CurrentReadingSection from "./sections/current-reading";
import DailyStackSection from "./sections/daily-stack";
import DeckSuggestionsSection from "./sections/deck-suggestions";
import JumpBackInSection from "./sections/jump-back-in";

type BooksPageContentProps = {
  homeSummary: ResGetMyHomeSummary;
  showColdStart: boolean;
};

export function BooksPageLoading() {
  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-8 text-foreground md:px-10 lg:px-20 xl:px-40">
      <div className="flex w-full max-w-[1200px] flex-col gap-10">
        <div className="space-y-4 px-2">
          <Skeleton className="h-9 w-48 md:w-56" />
          <Skeleton className="h-[220px] w-full rounded-xl md:h-[260px]" />
        </div>
        <div className="space-y-4 px-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-2/3 rounded-lg md:aspect-3/4"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BooksPageContent({
  homeSummary,
  showColdStart,
}: BooksPageContentProps) {
  if (showColdStart) {
    return <BooksColdStartHero />;
  }

  return (
    <>
      <DailyStackSection homeSummary={homeSummary} />
      <CurrentReadingSection homeSummary={homeSummary} />
      <DeckSuggestionsSection homeSummary={homeSummary} />
      <JumpBackInSection homeSummary={homeSummary} />
    </>
  );
}
