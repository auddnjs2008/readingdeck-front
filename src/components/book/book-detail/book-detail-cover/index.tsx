"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  coverUrl?: string | null;
  title?: string;
};

export default function BookDetailCover({ coverUrl, title }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasImage = coverUrl && !imageError;
  const coverSrc = hasImage ? coverUrl : null;

  if (!hasImage) {
    return (
      <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl">
        <span className="text-sm text-muted-foreground">No Cover</span>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl">
      <Image
        src={coverSrc!}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="absolute inset-0 scale-110 object-cover opacity-70 blur-xl"
      />
      <img
        src={coverSrc!}
        alt={title ?? "Book cover"}
        className="relative z-10 m-auto h-auto w-auto max-h-full max-w-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
