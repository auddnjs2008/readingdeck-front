"use client";

import Image from "next/image";
import { ArrowLeft, BookOpen, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import type { CardNodeData } from "./types";

type Props = {
  card: CardNodeData;
  onBack: () => void;
  onDelete: () => void;
};

const typeStyle: Record<CardNodeData["kind"], string> = {
  Insight: "text-blue-500 bg-blue-500/10",
  Change: "text-emerald-500 bg-emerald-500/10",
  Question: "text-amber-500 bg-amber-500/10",
  Quote: "text-purple-500 bg-purple-500/10",
};

export default function DeckCardDetailSidebar({ card, onBack, onDelete }: Props) {
  return (
    <aside className="flex h-full w-[390px] shrink-0 flex-col overflow-hidden border-l border-border bg-card shadow-xl">
      <div className="flex shrink-0 flex-col gap-4 border-b border-border p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDelete}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <EllipsisVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  typeStyle[card.kind]
                }`}
              >
                {card.kind}
              </span>
              <span className="text-xs text-muted-foreground">{card.meta}</span>
            </div>
            <h2 className="text-sm font-semibold leading-tight">{card.bookTitle}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">by {card.bookAuthor}</p>
          </div>
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded">
            <Image
              src={card.bookCover}
              alt={card.bookTitle}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            Your Thought
          </h3>
          <p className="text-xl font-bold leading-normal">{card.thought}</p>
          {card.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Source Quote
          </h3>
          <p className="text-base leading-relaxed italic text-muted-foreground">
            {card.quote?.trim() ? card.quote : "인용구 없음"}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-muted/20 p-4">
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Pencil className="h-4 w-4" />
          Edit Card Content
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="h-4 w-4" />
          덱에서 삭제
        </button>
      </div>
    </aside>
  );
}
