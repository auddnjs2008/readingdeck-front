"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import SafeImage from "@/components/ui/safe-image";
import { Tag } from "lucide-react";
import type { LibraryBook } from "../types";
import Link from "next/link";

type Props = {
  book: LibraryBook;
};

const statusBadgeClass: Record<NonNullable<LibraryBook["status"]>, string> = {
  finished:
    "border border-border/70 bg-background/88 text-emerald-700 shadow-none text-[10px] font-bold uppercase tracking-wider dark:border-white/10 dark:bg-black/30 dark:text-emerald-300",
  paused:
    "border border-border/70 bg-background/88 text-amber-700 shadow-none text-[10px] font-bold uppercase tracking-wider dark:border-white/10 dark:bg-black/30 dark:text-amber-300",
  reading:
    "border border-border/70 bg-background/88 text-sky-700 shadow-none text-[10px] font-bold uppercase tracking-wider dark:border-white/10 dark:bg-black/30 dark:text-sky-300",
};

const statusTextMap: Record<NonNullable<LibraryBook["status"]>, string> = {
  finished: "완독",
  paused: "중단",
  reading: "읽는 중",
};

export default function LibraryBookCard({ book }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasImage = book.backgroundImage && !imageError;
  const coverSrc = hasImage ? book.backgroundImage : null;

  return (
    <Link href={`/books/${book.id}`}>
      <div className="group flex cursor-pointer flex-col gap-3">
        <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-lg bg-muted shadow-paper transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-paper-lg">
          {hasImage ? (
            <>
              <SafeImage
                src={coverSrc!}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 220px"
                className="absolute inset-0 scale-110 object-cover opacity-70 blur-xl"
              />
              <img
                src={coverSrc!}
                alt={book.title}
                className="relative z-10 m-auto h-auto w-auto max-h-full max-w-full object-contain"
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground/70 bg-muted/50"
              aria-hidden="true"
            >
              표지 없음
            </div>
          )}
          <div className="absolute inset-0 z-5 bg-black/0 transition-colors duration-300 group-hover:bg-primary/5" />
          {book.status ? (
            <div className="absolute right-2 top-2 z-10">
              <Badge className={statusBadgeClass[book.status]}>
                {statusTextMap[book.status]}
              </Badge>
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="truncate text-base font-bold leading-tight text-foreground font-serif">
            {book.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {book.author}
          </p>
          <div className="mt-2.5 flex">
            <Badge className="gap-1 border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary shadow-none">
              <Tag className="h-3 w-3" />
              {book.cardsCount} 장
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
