"use client";

import { useMyHomeSummaryQuery } from "@/hooks/me/react-query/useMyHomeSummaryQuery";
import { useMyLibraryStatsQuery } from "@/hooks/me/react-query/useMyLibraryStatsQuery";

export function useBooksPageColdStart() {
  const homeSummaryQuery = useMyHomeSummaryQuery();
  const libraryStatsQuery = useMyLibraryStatsQuery();

  const isPending =
    homeSummaryQuery.isPending || libraryStatsQuery.isPending;

  let showColdStart = false;
  if (!isPending && !homeSummaryQuery.isError && homeSummaryQuery.data) {
    const d = homeSummaryQuery.data;
    const homeEmpty =
      (d.revisitCards?.length ?? 0) === 0 &&
      (d.currentReadingBooks?.length ?? 0) === 0 &&
      (d.recentRecordedBooks?.length ?? 0) === 0;
    const noBooksInLibrary =
      libraryStatsQuery.isSuccess && libraryStatsQuery.data.bookCount === 0;
    const libraryUnknown = libraryStatsQuery.isError;
    showColdStart = homeEmpty && (noBooksInLibrary || libraryUnknown);
  }

  return {
    homeSummaryQuery,
    libraryStatsQuery,
    isPending,
    showColdStart,
  };
}
