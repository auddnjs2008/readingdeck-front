"use client";

import { useState } from "react";

type Props = {
  coverUrl?: string | null;
  title?: string;
};

export default function BookDetailCover({ coverUrl, title }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasImage = coverUrl && !imageError;

  if (!hasImage) {
    return (
      <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl">
        <span className="text-sm text-muted-foreground">No Cover</span>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl">
      {/* Blurred background layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
      />
      {/* Foreground cover — original size, no upscale */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={title ?? "Book cover"}
        className="relative z-10 m-auto h-auto w-auto max-h-full max-w-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
