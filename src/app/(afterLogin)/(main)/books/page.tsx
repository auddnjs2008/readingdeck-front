import { CreateBookModal } from "@/components/book/create-book-modal";
import DailyStackSection from "@/components/book/sections/daily-stack";
import JumpBackInSection from "@/components/book/sections/jump-back-in";
import Link from "next/link";
import { Library } from "lucide-react";

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="flex justify-center border-b border-border/40 bg-muted/20 px-4 py-3">
        <div className="flex w-full max-w-[1200px] justify-end">
          <Link
            href="/books/library"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <Library className="h-4 w-4" />내 서재 전체보기
          </Link>
        </div>
      </div>
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-10">
          <DailyStackSection />
          <JumpBackInSection />
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <CreateBookModal
          triggerLabel=""
          triggerClassName="h-14 w-14 rounded-full p-0 shadow-lg shadow-primary/40"
        />
      </div>
    </div>
  );
}
