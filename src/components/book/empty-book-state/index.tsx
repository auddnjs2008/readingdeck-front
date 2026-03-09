"use client";

import { Library } from "lucide-react";

import { CreateBookModal } from "@/components/book/create-book-modal";

type Props = {
  title: string;
  description: string;
  triggerLabel?: string;
  className?: string;
};

export default function EmptyBookState({
  title,
  description,
  triggerLabel = "첫 번째 책 추가하기",
  className,
}: Props) {
  return (
    <div
      className={`flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/70 bg-muted/50 px-4 text-center animate-in fade-in-50 ${className ?? ""}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-sm">
        <Library className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-2">
        <CreateBookModal
          triggerLabel={triggerLabel}
          triggerClassName="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        />
      </div>
    </div>
  );
}
