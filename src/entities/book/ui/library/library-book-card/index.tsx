import LargeBookCard from "@/entities/book/ui/large-book-card";
import type { LibraryBook } from "../types";

const statusText = { finished: "완독", paused: "중단", reading: "읽는 중" };
const statusColor = {
  finished: "text-emerald-700 dark:text-emerald-300",
  paused: "text-muted-foreground",
  reading: "text-sky-700 dark:text-sky-300",
};

export default function LibraryBookCard({ book }: { book: LibraryBook }) {
  return (
    <div className="min-w-0">
      <LargeBookCard book={{ ...book, cardCount: book.cardsCount }} />
      {book.status ? (
        <p className={`mt-1 text-xs ${statusColor[book.status]}`}>{statusText[book.status]}</p>
      ) : null}
    </div>
  );
}
