"use client";

import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";
import LibraryToolbar from "../library-toolbar";
import { CreateBookModal } from "@/entities/book/ui/create-book-modal";

export default function LibraryPageHeader() {
  const { data: stats, isError, error } = useMyLibraryStatsQuery();
  if (isError) throw error;

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">
            내 서재
          </h1>
          <p className="mt-2 min-h-5 text-sm text-muted-foreground" aria-live="polite">
            {stats
              ? `책 ${stats.bookCount.toLocaleString()}권 · 카드 ${stats.cardCount.toLocaleString()}개`
              : "서재 통계를 불러오고 있습니다..."}
          </p>
        </div>
        <CreateBookModal triggerLabel="새 책 추가" triggerClassName="h-10 self-start rounded-[6px]! px-4" />
      </header>
      <LibraryToolbar />
    </>
  );
}
