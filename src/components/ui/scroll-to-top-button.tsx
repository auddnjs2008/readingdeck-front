"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/components/ui/utils";

type ScrollToTopButtonProps = {
  className?: string;
  threshold?: number;
};

export function ScrollToTopButton({
  className,
  threshold = 560,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-border/80 bg-background/92 px-4 text-sm font-semibold text-foreground shadow-[0_14px_32px_rgba(63,54,49,0.14)] backdrop-blur-md transition-colors hover:border-primary/35 hover:text-primary",
        "md:bottom-8 md:right-8",
        className
      )}
      aria-label="맨 위로 이동"
    >
      <ArrowUp className="h-4 w-4" />
      <span>맨 위로</span>
    </button>
  );
}
