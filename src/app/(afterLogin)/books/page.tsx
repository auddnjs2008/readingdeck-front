import { CreateBookModal } from "@/components/book/create-book-modal";
import LargeBookCard from "@/components/book/large-book-card";
import { Button } from "@/components/ui/button";
import { mockDailyStack, mockJumpBackIn } from "./mock-books";
import ThoughtCard from "@/components/card/thought-card";

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-10">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[32px]">
                Your Daily Stack
              </h1>
              <div className="hidden sm:flex">
                <CreateBookModal triggerLabel="Add New Book" />
              </div>
            </div>
            <div className="hide-scrollbar -mx-4 flex overflow-x-auto pb-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex min-w-full items-stretch gap-4 md:gap-6">
                {mockDailyStack.map((card) => (
                  <ThoughtCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 pt-4">
              <h2 className="text-[24px] font-bold leading-tight tracking-tight text-foreground">
                Jump Back In
              </h2>
              <Button variant="ghost" size="sm" className="px-0 text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 p-2 md:grid-cols-3 lg:grid-cols-4">
              {mockJumpBackIn.map((book) => (
                <LargeBookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
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
