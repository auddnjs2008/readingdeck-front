import type { LibraryBook } from "../types";
import LibraryBookCard from "../library-book-card";

type Props = {
  books: LibraryBook[];
};

export default function LibraryBookGrid({ books }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {books.map((book) => (
        <LibraryBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
