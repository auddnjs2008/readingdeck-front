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
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto w-full max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
        <div className="flex min-w-0 flex-col gap-10">
          <Suspense fallback={<LibraryBookListSkeleton />}>
            <LibraryPageHeader />
            <LibraryBookList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
