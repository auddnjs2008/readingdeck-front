import { Card } from "@/components/ui/card";
import { Book } from "@/type/book";

type Props = {
  book: Book;
};

export default function LargeBookCard({ book }: Props) {
  return (
    <Card
      key={book.title}
      className="group flex cursor-pointer flex-col gap-3 border-transparent bg-transparent shadow-none"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${book.backgroundImage})` }}
          aria-hidden="true"
        ></div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-muted">
          {/* <div
            className={`h-full ${book.barColor}`}
            style={{ width: book.progress }}
          ></div> */}
        </div>
      </div>
      <div className="pl-3 pb-3">
        <p className="truncate text-base font-semibold leading-normal text-foreground">
          {book.title}
        </p>
        <p className="truncate text-sm font-normal leading-normal text-muted-foreground">
          {book.author}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-primary">
            {/* {book.progress} */}
            30
          </span>
          <span className="text-xs text-muted-foreground">• 3h left</span>
        </div>
      </div>
    </Card>
  );
}
