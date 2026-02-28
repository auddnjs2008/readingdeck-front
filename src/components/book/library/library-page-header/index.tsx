"use client";

import { useMyLibraryStatsQuery } from "@/hooks/me/react-query/useMyLibraryStatsQuery";

export default function LibraryPageHeader() {
  const { data: stats } = useMyLibraryStatsQuery();
  const bookCount = stats?.bookCount ?? 0;
  const cardCount = stats?.cardCount ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-serif">
        내 서재
      </h1>
      <p className="text-sm text-muted-foreground">
        총 {bookCount}권의 책과 {cardCount.toLocaleString()}장의 카드가 있습니다.
      </p>
    </div>
  );
}
