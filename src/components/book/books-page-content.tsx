"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BooksColdStartHero } from "./books-cold-start-hero";
import CurrentReadingSection from "./sections/current-reading";
import DailyStackSection from "./sections/daily-stack";
import DeckSuggestionsSection from "./sections/deck-suggestions";
import HomeSummaryError from "./sections/home-summary-error";
import JumpBackInSection from "./sections/jump-back-in";
import { useBooksPageColdStart } from "./use-books-page-cold-start";

function BooksPageLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-4 px-2">
        <Skeleton className="h-9 w-48 md:w-56" />
        <Skeleton className="h-[220px] w-full rounded-xl md:h-[260px]" />
      </div>
      <div className="space-y-4 px-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 rounded-lg md:aspect-3/4" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BooksPageContent() {
  const { homeSummaryQuery, isPending, showColdStart } = useBooksPageColdStart();

  if (isPending) {
    return <BooksPageLoading />;
  }

  if (homeSummaryQuery.isError) {
    return (
      <HomeSummaryError onRetry={() => homeSummaryQuery.refetch()} />
    );
  }

  if (showColdStart) {
    return <BooksColdStartHero />;
  }

  return (
    <>
      <DailyStackSection />
      <CurrentReadingSection />
      <DeckSuggestionsSection />
      <JumpBackInSection />
    </>
  );
}
