"use client";

import { useState } from "react";
import SafeImage from "@/shared/ui/safe-image";

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
      <div className="relative mx-auto flex aspect-2/3 w-full max-w-[180px] items-center justify-center overflow-hidden border border-black/10 bg-[#e6e0d7] dark:border-white/10 dark:bg-[#393631] lg:max-w-none">
        <span className="text-sm text-muted-foreground">No Cover</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex aspect-2/3 w-full max-w-[180px] items-center justify-center overflow-hidden border border-black/10 bg-[#e6e0d7] dark:border-white/10 dark:bg-[#393631] lg:max-w-none">
      <div className="relative h-[88%] w-[88%]">
        <SafeImage
          src={coverSrc!}
          alt={title ?? "Book cover"}
          fill
          sizes="(max-width: 1024px) 152px, 236px"
          className="object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}
