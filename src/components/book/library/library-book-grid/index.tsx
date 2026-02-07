import type { LibraryBook } from "../types";
import LibraryBookCard from "../library-book-card";

type Props = {
  books: LibraryBook[];
};

export default function LibraryBookGrid({ books }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <LibraryBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
