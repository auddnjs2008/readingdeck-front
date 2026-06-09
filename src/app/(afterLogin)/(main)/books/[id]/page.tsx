import type { Metadata } from "next";
import { Suspense } from "react";
import BookDetailContent from "@/entities/book/ui/book-detail/book-detail-content";
import BookDetailSidebar, {
  BookDetailSidebarSkeleton,
} from "@/entities/book/ui/book-detail/book-detail-sidebar";

export const metadata: Metadata = {
  title: "책 상세",
};

type BookDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function BookDetailPage({ params }: BookDetailPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-full flex-col px-6 py-10 md:px-12 lg:px-24 xl:px-40">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 lg:flex-row">
          <Suspense fallback={<BookDetailSidebarSkeleton />}>
            {params.then(({ id }) => (
              <BookDetailSidebar bookId={Number(id)} />
            ))}
          </Suspense>
          <BookDetailContent />
        </div>
      </div>
    </div>
  );
}
