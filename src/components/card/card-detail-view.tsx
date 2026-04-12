"use client";

import dayjs from "dayjs";
import { BookOpen, Quote } from "lucide-react";

import { cardStyles } from "@/components/card/card-style";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/ui/dialog";
import { cn } from "@/components/ui/utils";
import type { ResGetCardDetail } from "@/service/card/getCardDetail";

const CARD_LABELS: Record<ResGetCardDetail["type"], string> = {
  insight: "Insight",
  change: "Change",
  action: "Action",
  question: "Question",
};

const formatPageRange = (pageStart: number | null, pageEnd: number | null) => {
  if (pageStart && pageEnd) return `p.${pageStart}-${pageEnd}`;
  if (pageStart) return `p.${pageStart}`;
  if (pageEnd) return `p.${pageEnd}`;
  return null;
};

type Props = {
  card: ResGetCardDetail;
  onBookDetailClick?: () => void;
  className?: string;
  variant?: "default" | "modal";
};

export default function CardDetailView({
  card,
  onBookDetailClick,
  className,
  variant = "default",
}: Props) {
  const style = cardStyles[card.type];
  const pageRange = formatPageRange(card.pageStart, card.pageEnd);
  const savedDateLabel = dayjs(card.createdAt).format("YYYY.MM.DD");
  const hasTitle = Boolean(card.title?.trim());

  if (variant === "modal") {
    return (
      <div className="flex max-h-[90vh] min-h-0 flex-col">
        {/* Header - 고정 */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/70 bg-card px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold uppercase tracking-wide text-foreground">
              {CARD_LABELS[card.type]}
            </span>
          </div>
          <DialogCloseButton className="h-10 w-10 rounded-full border border-border/70 bg-background/90 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" />
        </div>

        {/* Content - 스크롤 영역 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="space-y-6">
            <Badge className={cn("border px-3 py-1 text-[11px]", style.badgeClass)}>
              {CARD_LABELS[card.type]}
            </Badge>

            <div>
              {hasTitle ? (
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {card.title}
                </p>
              ) : null}
              <h2 className="whitespace-pre-line text-lg font-semibold leading-relaxed text-foreground md:text-xl">
                {card.thought}
              </h2>
            </div>

            {card.quote ? (
              <section className="relative overflow-hidden rounded-xl border border-border/70 bg-muted/30 px-6 py-5">
                <div className="absolute inset-y-5 left-6 w-1 rounded-full bg-primary/80" />
                <div className="pl-5">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Original Quote
                  </p>
                  <blockquote className="whitespace-pre-line font-serif text-lg italic leading-relaxed text-foreground/90">
                    &ldquo;{card.quote}&rdquo;
                  </blockquote>
                </div>
              </section>
            ) : null}

            <section className="flex flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-5">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{card.book.title}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>{card.book.author}</span>
                  {card.book.publisher ? <span>{card.book.publisher}</span> : null}
                  {pageRange ? <span>{pageRange}</span> : null}
                  <span>{savedDateLabel} 저장</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer - 고정 */}
        <div className="flex shrink-0 items-center gap-3 border-t border-border/70 bg-card px-6 py-4">
          {onBookDetailClick ? (
            <Button
              type="button"
              className="h-11 flex-1 rounded-xl"
              onClick={onBookDetailClick}
            >
              <BookOpen className="h-4 w-4" />
              책 상세 보기
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border/70 bg-card text-foreground shadow-[0_24px_60px_rgba(63,54,49,0.14)]",
        className
      )}
    >
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative px-7 pb-8 pt-7">
        <div className="space-y-8">
          <section className="space-y-5">
            <Badge className={cn("border px-3 py-1 text-[11px]", style.badgeClass)}>
              {CARD_LABELS[card.type]}
            </Badge>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl space-y-4">
                <div className="space-y-2">
                  {hasTitle ? (
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground/90">
                      {card.title}
                    </div>
                  ) : (
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground/90">
                      Thought
                    </div>
                  )}
                </div>
                <h1 className="whitespace-pre-wrap text-3xl font-semibold leading-[1.18] tracking-tight text-foreground md:text-[2.7rem]">
                  {card.thought}
                </h1>
                <p className="text-base text-muted-foreground md:text-lg">
                  {card.book.author}
                  {card.book.publisher ? ` · ${card.book.publisher}` : ""}
                </p>
              </div>

              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <p>{dayjs(card.updatedAt).format("YYYY.MM.DD")} 업데이트</p>
                {pageRange ? <p className="mt-1">{pageRange}</p> : null}
              </div>
            </div>
          </section>

        {card.quote ? (
            <section className="relative overflow-hidden rounded-[24px] border border-border/70 bg-muted/28 px-6 py-6">
              <div className="absolute inset-y-6 left-6 w-1 rounded-full bg-primary/80" />
              <div className="pl-6">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                  <Quote className="h-3.5 w-3.5" />
                  Original Quote
                </div>
                <blockquote className="whitespace-pre-line font-serif text-xl leading-relaxed text-foreground/90 md:text-[1.7rem] md:leading-[1.45]">
                  “{card.quote}”
                </blockquote>
              </div>
            </section>
        ) : null}

          <section className="border-t border-border/70 pt-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">{card.book.title}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>{card.book.author}</span>
                  {pageRange ? <span>{pageRange}</span> : null}
                  <span>{savedDateLabel} 저장</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.revisitCount > 0
                    ? `${card.revisitCount}번 다시 본 카드`
                    : "아직 다시 보지 않은 카드"}
                </p>
              </div>

              {onBookDetailClick ? (
                <Button
                  type="button"
                  className="h-11 rounded-xl px-5"
                  onClick={onBookDetailClick}
                >
                  <BookOpen className="h-4 w-4" />
                  책 상세 보기
                </Button>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
