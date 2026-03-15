"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import type { LibraryBook } from "../types";
import Link from "next/link";

type Props = {
  book: LibraryBook;
};

const statusBadgeClass: Record<NonNullable<LibraryBook["status"]>, string> = {
  Completed:
    "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300 shadow-none border-0 text-[10px] font-bold uppercase tracking-wider",
  Paused:
    "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300 shadow-none border-0 text-[10px] font-bold uppercase tracking-wider",
  Reading:
    "bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300 shadow-none border-0 text-[10px] font-bold uppercase tracking-wider",
};

const statusTextMap: Record<NonNullable<LibraryBook["status"]>, string> = {
  Completed: "완독",
  Paused: "보류",
  Reading: "읽는 중",
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
              <Image
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
