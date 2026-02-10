"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme/theme-provider";
import { Book } from "@/type/book";
import Link from "next/link";

type Props = {
  book: Book;
};

const fallbackColorFromText = (_value: string, isDark: boolean) => {
  return isDark ? "#2B3A4A" : "#E8F1FF";
};

export default function LargeBookCard({ book }: Props) {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fallbackColor = useMemo(
    () =>
      fallbackColorFromText(
        [book.title, book.author].filter(Boolean).join("|") || "book",
        isDark
      ),
    [book.author, book.title, isDark]
  );

  const backgroundColor = book.backgroundImage ? fallbackColor : "var(--muted)";

  return (
    <Card
      key={book.title}
      className="group flex cursor-pointer flex-col gap-3 border-transparent bg-transparent shadow-none md:gap-4"
    >
      <Link href={`/books/${book.id}`}>
        <div
          className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 md:aspect-3/4"
          style={{ backgroundColor }}
        >
          {book.backgroundImage && !imageError ? (
            <>
              {/* Blurred background layer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.backgroundImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
              />
              {/* Foreground cover image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.backgroundImage}
                alt={book.title}
                className="relative z-10 m-auto h-auto w-auto max-h-full max-w-full"
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              No Cover
            </div>
          )}
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
              {book.cardCount}개 카드
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
