import BookDetailContent from "@/components/book/book-detail/book-detail-content";
import BookDetailSidebar from "@/components/book/book-detail/book-detail-sidebar";

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-full flex-col px-6 py-10 md:px-12 lg:px-24 xl:px-40">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 lg:flex-row">
          <BookDetailSidebar />
          <BookDetailContent />
        </div>
      </div>
    </div>
  );
}
