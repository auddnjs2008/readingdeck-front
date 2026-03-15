"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/type/card";
import { cardStyles } from "../card-style";
import { useRouter } from "next/navigation";

const defaultTagClass = "bg-muted text-muted-foreground border-border";

export default function ThoughtCard({ card }: { card: CardType }) {
  const router = useRouter();
  const tagClass =
    card.type in cardStyles
      ? cardStyles[card.type as keyof typeof cardStyles].tagClass
      : defaultTagClass;

  const handleReadClick = () => {
    if (!card.book) return;
    router.push(`/books/${card.book.id}`);
  };

  return (
    <Card
      key={card.id}
      className="group flex max-w-[400px] cursor-pointer flex-1 flex-col gap-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-paper-lg dark:border-transparent"
      onClick={handleReadClick}
    >
      {/* 상단: 단일 톤 배경 + 책 제목·저자 */}
      <div className="relative flex h-32 flex-col rounded-t-xl bg-muted px-4 pb-4 pt-10">
        {/* 타입 뱃지: 상단 왼쪽 고정 (제목·저자와 겹치지 않음) */}
        <div className="absolute left-4 top-3">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${tagClass}`}
          >
            {card.type}
          </span>
        </div>
        {/* 제목·저자: 테마 토큰으로 라이트/다크 대비 확보 */}
        <div className="flex flex-1 flex-col justify-end text-left">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {card.book?.title ?? "Unknown"}
          </h3>
          {card.book?.author ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {card.book.author}
            </p>
          ) : null}
        </div>
      </div>

      {/* 하단: 카드 내용(인용/생각)만, 제목 중복 제거 */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3 whitespace-pre-line">
          {card.quote ?? card.thought}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="px-0 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            Read
          </span>
        </div>
      </div>
    </Card>
  );
}
