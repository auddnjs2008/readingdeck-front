import { CreateBookModal } from "@/components/book/create-book-modal";
import DailyStackSection from "@/components/book/sections/daily-stack";

import JumpBackInSection from "@/components/book/sections/jump-back-in";

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-10">
          <DailyStackSection />
          <JumpBackInSection />
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <CreateBookModal
          triggerLabel=""
          triggerClassName="h-14 w-14 rounded-full p-0 shadow-lg shadow-[#137fec]/40"
        />
      </div>
    </div>
  );
}
