import type { Metadata } from "next";
import { Suspense } from "react";

import BooksPageClient, {
  BooksPageLoading,
} from "@/entities/book/ui/books-page-client";
import { getMyHomeSummaryServer } from "@/entities/me/api/getMyHomeSummary.server";
import { getMyLibraryStatsServer } from "@/entities/me/api/getMyLibraryStats.server";

export const metadata: Metadata = {
  title: "책",
};

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksPageLoading />}>
      <BooksPageContent />
    </Suspense>
  );
}

async function BooksPageContent() {
  const [homeSummary, libraryStats] = await Promise.all([
    getMyHomeSummaryServer(),
    getMyLibraryStatsServer(),
  ]);

  const homeEmpty =
    homeSummary.revisitCards.length === 0 &&
    homeSummary.currentReadingBooks.length === 0 &&
    homeSummary.recentRecordedBooks.length === 0;
  const showColdStart = homeEmpty && libraryStats.bookCount === 0;
  const showLibraryBar = !showColdStart;

  return (
    <BooksPageClient
      homeSummary={homeSummary}
      showColdStart={showColdStart}
      showLibraryBar={showLibraryBar}
    />
  );
}
