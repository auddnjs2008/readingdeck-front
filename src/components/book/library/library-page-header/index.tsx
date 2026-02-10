"use client";

import { useMyLibraryStatsQuery } from "@/hooks/me/react-query/useMyLibraryStatsQuery";

export default function LibraryPageHeader() {
  const { data: stats } = useMyLibraryStatsQuery();
  const bookCount = stats?.bookCount ?? 0;
  const cardCount = stats?.cardCount ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        내 서재
      </h1>
      <p className="text-sm text-muted-foreground">
        {bookCount}권의 책 • 카드 {cardCount.toLocaleString()}장 생성
      </p>
    </div>
  );
}
