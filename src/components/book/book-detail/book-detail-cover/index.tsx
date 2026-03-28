"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/safe-image";

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
      <div className="relative mx-auto flex aspect-2/3 w-full max-w-[108px] items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl sm:max-w-[144px] md:max-w-[180px] lg:max-w-none">
        <span className="text-sm text-muted-foreground">No Cover</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex aspect-2/3 w-full max-w-[108px] items-center justify-center overflow-hidden rounded-xl bg-muted shadow-2xl sm:max-w-[144px] md:max-w-[180px] lg:max-w-none">
      <SafeImage
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
