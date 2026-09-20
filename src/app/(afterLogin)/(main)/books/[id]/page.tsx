import type { Metadata } from "next";
import BookDetailContent from "@/entities/book/ui/book-detail/book-detail-content";
import BookDetailSidebar from "@/entities/book/ui/book-detail/book-detail-sidebar";

export const metadata: Metadata = {
  title: "책 상세",
};

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-5 py-10 md:px-8 md:py-14 lg:flex-row lg:items-start lg:gap-14">
        <BookDetailSidebar />
        <BookDetailContent />
      </div>
    </div>
  );
}
