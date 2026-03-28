"use client";

import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

const OPTIMIZED_HOSTS = new Set([
  "images.unsplash.com",
  "readingdeck.s3.ap-northeast-2.amazonaws.com",
  "d30f9djudvl18y.cloudfront.net",
  "lh3.googleusercontent.com",
]);

type SafeImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height"
> & {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

function canUseNextImage(src: string) {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return true;
  }

  try {
    const url = new URL(src);
    return OPTIMIZED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  sizes,
  width,
  height,
  className,
  onError,
  ...rest
}: SafeImageProps) {
  if (canUseNextImage(src)) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          onError={onError}
          {...rest}
        />
      );
    }

    if (width && height) {
      return (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={className}
          onError={onError}
          {...rest}
        />
      );
    }
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        className={["h-full w-full", className].filter(Boolean).join(" ")}
        onError={onError}
        {...rest}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={onError}
      {...rest}
    />
  );
}
