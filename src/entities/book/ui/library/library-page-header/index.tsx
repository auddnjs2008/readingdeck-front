"use client";

import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";
import LibraryToolbar from "../library-toolbar";

export default function LibraryPageHeader() {
  const { data: stats, isError, error } = useMyLibraryStatsQuery();
  if (isError) throw error;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-serif">
          내 서재
        </h1>
        <p className="text-sm text-muted-foreground">
          {stats
            ? `총 ${stats.bookCount}권의 책과 ${stats.cardCount.toLocaleString()}장의 카드가 있습니다.`
            : "서재 통계를 불러오고 있습니다..."}
        </p>
      </div>
      {stats && stats.bookCount > 0 && <LibraryToolbar />}
    </>
  );
}
