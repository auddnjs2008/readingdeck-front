"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import type { LibraryBook } from "../types";

type Props = {
  book: LibraryBook;
};

const statusBadgeClass: Record<
  NonNullable<LibraryBook["status"]>,
  string
> = {
  Completed:
    "bg-emerald-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider",
  Paused:
    "bg-amber-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider",
  Reading:
    "bg-blue-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider",
};

export default function LibraryBookCard({ book }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasImage = book.backgroundImage && !imageError;

  return (
    <div className="group flex cursor-pointer flex-col gap-3">
      <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-lg bg-muted shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
        {hasImage ? (
          <>
            {/* Blurred background layer */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.backgroundImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
            />
            {/* Foreground cover — original size, no upscale */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.backgroundImage}
              alt={book.title}
              className="relative z-10 m-auto h-auto w-auto max-h-full max-w-full object-contain"
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
        <div className="absolute inset-0 z-5 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        {book.status ? (
          <div className="absolute right-2 top-2 z-10">
            <Badge className={statusBadgeClass[book.status]}>
              {book.status}
            </Badge>
          </div>
        ) : null}
      </div>
      <div>
        <h3 className="truncate text-base font-bold leading-tight text-foreground">
          {book.title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {book.author}
        </p>
        <div className="mt-2.5 flex">
          <Badge className="gap-1 border border-primary/20 bg-card px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
            <Tag className="h-3 w-3" />
            {book.cardsCount} Cards
          </Badge>
        </div>
      </div>
    </div>
  );
}
