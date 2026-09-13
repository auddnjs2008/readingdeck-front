"use client";

import { CreateBookModal } from "@/entities/book/ui/create-book-modal";

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
      className={`flex min-h-[260px] w-full flex-col items-center justify-center border-y border-[#d8d4cc] px-4 text-center dark:border-[#4b4842] ${className ?? ""}`}
    >
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
        <p className="text-sm text-[#77726b] dark:text-[#aaa49b]">
          {description}
        </p>
      </div>
      <div className="mt-2">
        <CreateBookModal
          triggerLabel={triggerLabel}
          triggerClassName="rounded-[4px] bg-[#a45138] text-white shadow-none hover:bg-[#8e432f] dark:bg-[#d77b5e] dark:hover:bg-[#c66e53]"
        />
      </div>
    </div>
  );
}
