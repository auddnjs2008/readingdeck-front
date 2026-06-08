import type { BookDetailSidebarInfo } from "../types";

type Props = Pick<BookDetailSidebarInfo, "title" | "author" | "year" | "rating">;

export default function BookDetailMeta({ title, author, year, rating }: Props) {
  const ratingDisplay = rating != null ? rating.toFixed(1) : null;
  const stars = rating != null ? Math.round(rating) : 0;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold leading-tight tracking-tight font-serif">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        {author}
        {year ? `, ${year}` : ""}
      </p>
      {ratingDisplay != null && (
        <div className="mt-1 flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-base">
              {i < stars ? "★" : "☆"}
            </span>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({ratingDisplay})
          </span>
        </div>
      )}
    </div>
  );
}
