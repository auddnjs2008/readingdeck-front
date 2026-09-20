"use client";

import dayjs from "dayjs";
import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/ui/utils";
import type { ResGetCardDetail } from "@/entities/card/api/getCardDetail";

const CARD_LABELS: Record<ResGetCardDetail["type"], string> = {
  insight: "인사이트",
  change: "변화",
  action: "행동",
  question: "질문",
};

const formatPageRange = (pageStart: number | null, pageEnd: number | null) => {
  if (pageStart && pageEnd) return `p.${pageStart}-${pageEnd}`;
  if (pageStart) return `p.${pageStart}`;
  if (pageEnd) return `p.${pageEnd}`;
  return null;
};

type Props = {
  afterContent?: ReactNode;
  card: ResGetCardDetail;
  bookDetailHref?: string;
  className?: string;
  variant?: "default" | "modal";
};

export default function CardDetailView({
  afterContent,
  card,
  bookDetailHref,
  className,
  variant = "default",
}: Props) {
  const pageRange = formatPageRange(card.pageStart, card.pageEnd);
  const savedDateLabel = dayjs(card.createdAt).format("YYYY.MM.DD");
  const hasTitle = Boolean(card.title?.trim());
  const revisitLabel =
    card.revisitCount > 0
      ? `${card.revisitCount}번 다시 본 카드`
      : "아직 다시 보지 않은 카드";

  if (variant === "modal") {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <article className="space-y-6 overflow-clip [overflow-wrap:anywhere]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a45138] dark:text-[#d77b5e]">
              <span>{CARD_LABELS[card.type]}</span>
              {pageRange ? <span>{pageRange}</span> : null}
            </div>

            {hasTitle ? (
              <h2 className="whitespace-pre-wrap break-words font-serif text-[1.625rem] font-normal leading-snug text-foreground">
                {card.title}
              </h2>
            ) : null}

            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">처음 남긴 생각</h3>
              <p className="whitespace-pre-wrap break-words text-base leading-7 text-foreground">
                {card.thought}
              </p>
            </section>

            {card.quote ? (
              <section className="border-l border-[#8a857d] pl-4 dark:border-[#77726b]">
                <p className="mb-2 text-xs text-[#a45138] dark:text-[#d77b5e]">원문 인용</p>
                <blockquote className="whitespace-pre-wrap break-words font-serif text-base leading-relaxed text-foreground/85">
                  {card.quote}
                </blockquote>
              </section>
            ) : null}

            <section className="space-y-2 border-t border-[#8a857d] pt-5 dark:border-[#77726b]">
              <p className="break-words font-serif text-lg text-foreground">
                {card.book.title}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#746f68] dark:text-[#aaa49b]">
                <span>{card.book.author}</span>
                {card.book.publisher ? <span>{card.book.publisher}</span> : null}
                <span>{savedDateLabel} 저장</span>
                <span>{revisitLabel}</span>
              </div>
            </section>
          </article>
          {afterContent}
        </div>

        {bookDetailHref ? (
          <div className="shrink-0 border-t border-[#8a857d] px-6 py-4 sm:px-8 dark:border-[#77726b]">
            <Button as={Link} href={bookDetailHref} className="h-11 w-full">
              <BookOpen className="h-4 w-4" />
              책 상세 보기
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <article className={cn("overflow-clip text-foreground [overflow-wrap:anywhere]", className)}>
      <div className="space-y-8 px-1 py-2 sm:px-4 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#a45138] dark:text-[#d77b5e]">
          <span>{CARD_LABELS[card.type]}</span>
          {pageRange ? <span>{pageRange}</span> : null}
        </div>

        {hasTitle ? (
          <h1 className="whitespace-pre-wrap break-words font-serif text-3xl font-normal leading-snug text-foreground sm:text-4xl">
            {card.title}
          </h1>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">처음 남긴 생각</h2>
          <p className="whitespace-pre-wrap break-words text-base leading-7 text-foreground sm:text-lg sm:leading-8">
            {card.thought}
          </p>
        </section>

        {card.quote ? (
          <section className="border-l border-[#8a857d] pl-5 dark:border-[#77726b] sm:pl-6">
            <p className="mb-3 text-xs text-[#a45138] dark:text-[#d77b5e]">원문 인용</p>
            <blockquote className="whitespace-pre-wrap break-words font-serif text-lg leading-relaxed text-foreground/85 sm:text-xl">
              {card.quote}
            </blockquote>
          </section>
        ) : null}

        <section className="flex flex-wrap items-end justify-between gap-5 border-t border-[#8a857d] pt-7 dark:border-[#77726b]">
          <div className="min-w-0 space-y-2">
            <p className="break-words font-serif text-xl text-foreground">
              {card.book.title}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#746f68] dark:text-[#aaa49b]">
              <span>{card.book.author}</span>
              {card.book.publisher ? <span>{card.book.publisher}</span> : null}
              <span>{savedDateLabel} 저장</span>
              <span>{revisitLabel}</span>
            </div>
          </div>

          {bookDetailHref ? (
            <Button as={Link} href={bookDetailHref} className="h-11 px-5">
              <BookOpen className="h-4 w-4" />
              책 상세 보기
            </Button>
          ) : null}
        </section>
        {afterContent}
      </div>
    </article>
  );
}
