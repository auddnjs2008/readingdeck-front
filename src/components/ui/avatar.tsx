import type { HTMLAttributes } from "react";
import { cn } from "./utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  fallback?: string;
};

export function Avatar({ className, src, alt = "Avatar", fallback }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold text-muted-foreground",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        fallback ?? "?"
      )}
    </div>
  );
}
