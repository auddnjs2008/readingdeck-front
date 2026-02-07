import { mockDailyStack } from "@/app/(afterLogin)/books/mock-books";
import { CreateBookModal } from "../../create-book-modal";
import ThoughtCard from "@/components/card/thought-card";

export default function DailyStackSection() {
  return (
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
  );
}
