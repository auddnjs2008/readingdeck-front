import type { Metadata } from "next";
import { Suspense } from "react";

import LibraryBookList, {
  LibraryBookListSkeleton,
} from "@/entities/book/ui/library/library-book-list";
import LibraryPageHeader from "@/entities/book/ui/library/library-page-header";

export const metadata: Metadata = {
  title: "내 서재",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-8">
          <Suspense fallback={<LibraryBookListSkeleton />}>
            <LibraryPageHeader />
            <LibraryBookList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
