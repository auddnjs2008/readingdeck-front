"use client";

import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

import SafeImage from "@/shared/ui/safe-image";
import { Book } from "@/entities/book/model/types";
import Link from "next/link";

type Props = {
  book: Book;
};

export default function LargeBookCard({ book }: Props) {
  const [imageError, setImageError] = useState(false);
  const [surface, setSurface] = useState<{ src: string; color: string }>();
  const coverSrc =
    book.backgroundImage && !imageError ? book.backgroundImage : null;
  const coverSurface = surface?.src === coverSrc ? surface.color : undefined;

  useEffect(() => {
    if (!coverSrc) return;

    let active = true;
    const averageColor = new FastAverageColor();

    void averageColor
      .getColorAsync(coverSrc, {
        algorithm: "dominant",
        crossOrigin: "anonymous",
        silent: true,
      })
      .then(({ value: [red, green, blue] }) => {
        if (active) {
          setSurface({
            src: coverSrc,
            color: `rgba(${red}, ${green}, ${blue}, 0.14)`,
          });
        }
      })
      .catch(() => undefined)
      .finally(() => averageColor.destroy());

    return () => {
      active = false;
    };
  }, [coverSrc]);

  return (
    <article className="group min-w-0">
      <Link href={`/books/${book.id}`} className="block focus-visible:outline-none">
        <div
          className="relative flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded-[4px] border border-black/10 bg-[#e6e0d7] transition-opacity group-hover:opacity-90 group-focus-visible:ring-2 group-focus-visible:ring-[#a45138] dark:border-white/10 dark:bg-[#393631] dark:group-focus-visible:ring-[#d77b5e]"
          style={{ backgroundColor: coverSurface }}
        >
          {coverSrc ? (
            <SafeImage
              src={coverSrc}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-scale-down drop-shadow-[0_4px_6px_rgba(48,39,34,0.16)]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              No Cover
            </div>
          )}
        </div>
        <div className="pt-3">
          <p className="truncate font-serif text-base font-semibold leading-normal">
            {book.title}
          </p>
          <p className="truncate text-sm leading-normal text-[#77726b] dark:text-[#aaa49b]">
            {book.author}
          </p>
          {book.status === "reading" &&
          book.currentPage != null &&
          book.totalPages != null ? (
            <p className="mt-1 text-xs text-[#77726b] dark:text-[#aaa49b]">
              {book.currentPage} / {book.totalPages}p
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-medium text-[#a45138] dark:text-[#d77b5e]">
              {book.cardCount}개 카드
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
