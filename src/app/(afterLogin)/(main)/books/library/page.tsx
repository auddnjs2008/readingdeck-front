import { Suspense } from "react";

import LibraryBookList from "@/components/book/library/library-book-list";
import LibraryPageHeader from "@/components/book/library/library-page-header";
import LibraryToolbar from "@/components/book/library/library-toolbar";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-8">
          <LibraryPageHeader />
          <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-muted/50" />}>
            <LibraryToolbar />
          </Suspense>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] animate-pulse rounded-xl bg-muted/50"
                  />
                ))}
              </div>
            }
          >
            <LibraryBookList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
