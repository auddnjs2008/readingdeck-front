import type { Metadata } from "next";
import { Suspense } from "react";

import { getBooksServer } from "@/entities/book/api/getBooks.server";
import LibraryBookList, {
  LibraryBookListSkeleton,
} from "@/entities/book/ui/library/library-book-list";
import LibraryPageHeader from "@/entities/book/ui/library/library-page-header";
import LibraryToolbar from "@/entities/book/ui/library/library-toolbar";

export const metadata: Metadata = {
  title: "내 서재",
};

type LibraryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function LibraryToolbarGate() {
  const booksData = await getBooksServer({
    query: { page: 1, take: 1, sort: "createdAt" },
  });

  if (booksData.meta.total === 0) {
    return null;
  }

  return <LibraryToolbar />;
}

async function LibraryBookListSection({
  searchParams,
}: {
  searchParams: LibraryPageProps["searchParams"];
}) {
  const resolvedSearchParams = await searchParams;
  return <LibraryBookList searchParams={resolvedSearchParams} />;
}

export default function LibraryPage({ searchParams }: LibraryPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-8">
          <LibraryPageHeader />
          <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-muted/50" />}>
            <LibraryToolbarGate />
          </Suspense>
          <Suspense fallback={<LibraryBookListSkeleton />}>
            <LibraryBookListSection searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
