"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";
import { CreateBookModal } from "@/entities/book/ui/create-book-modal";
import BooksPageContent, { BooksPageLoading } from "./books-page-content";

export { BooksPageLoading };

export default function BooksPageClient() {
  const summary = useQuery({
    queryKey: RQmeQueryKey.homeSummary(),
    queryFn: getMyHomeSummary,
    throwOnError: true,
  });
  const stats = useMyLibraryStatsQuery();
  if (summary.isError) throw summary.error;
  if (stats.isError) throw stats.error;
  if (summary.isPending || stats.isPending) return <BooksPageLoading />;

  const homeSummary = summary.data;
  const showColdStart = stats.data.bookCount === 0 &&
    homeSummary.revisitCards.length === 0 &&
    homeSummary.currentReadingBooks.length === 0 &&
    homeSummary.recentRecordedBooks.length === 0;
  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors duration-200 dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
        {!showColdStart && (
          <div className="mb-12 flex items-end justify-between gap-5">
            <div>
              <h1 className="font-serif text-3xl font-semibold">홈</h1>
              <p className="mt-2 text-sm text-muted-foreground">오늘의 카드를 다시 읽고, 기록을 이어가세요.</p>
            </div>
            <div className="hidden sm:block"><CreateBookModal triggerLabel="새 책 추가" triggerVariant="outline" /></div>
          </div>
        )}
        <div className="flex w-full flex-col gap-16 md:gap-20">
          <BooksPageContent
            homeSummary={homeSummary}
            showColdStart={showColdStart}
          />
        </div>
      </main>

      <div className="fixed bottom-[calc(1.5rem+var(--mobile-nav-offset))] right-6 z-40 sm:hidden">
        <CreateBookModal
          triggerLabel=""
          triggerClassName="h-14 w-14 rounded-full bg-[#a45138] p-0 text-white shadow-md dark:bg-[#d77b5e]"
        />
      </div>
    </div>
  );
}
