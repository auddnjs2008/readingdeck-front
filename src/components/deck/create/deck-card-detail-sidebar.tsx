"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, BookOpen, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import type { CardNodeData } from "./types";

type Props = {
  card: CardNodeData;
  onBack: () => void;
  onDelete: () => void;
  onUpdate: (payload: {
    kind: CardNodeData["kind"];
    thought: string;
    quote: string;
    pageStart: number | null;
    pageEnd: number | null;
  }) => void;
};

const typeStyle: Record<CardNodeData["kind"], string> = {
  Insight: "text-blue-500 bg-blue-500/10",
  Change: "text-emerald-500 bg-emerald-500/10",
  Action: "text-cyan-500 bg-cyan-500/10",
  Question: "text-amber-500 bg-amber-500/10",
  Quote: "text-purple-500 bg-purple-500/10",
};

const KIND_OPTIONS: CardNodeData["kind"][] = [
  "Insight",
  "Change",
  "Action",
  "Question",
  "Quote",
];

const parseNullableNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function DeckCardDetailSidebar({
  card,
  onBack,
  onDelete,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [kindDraft, setKindDraft] = useState<CardNodeData["kind"]>(card.kind);
  const [thoughtDraft, setThoughtDraft] = useState(card.thought);
  const [quoteDraft, setQuoteDraft] = useState(card.quote ?? "");
  const [pageStartDraft, setPageStartDraft] = useState(
    card.pageStart == null ? "" : String(card.pageStart)
  );
  const [pageEndDraft, setPageEndDraft] = useState(
    card.pageEnd == null ? "" : String(card.pageEnd)
  );

  const handleSave = () => {
    onUpdate({
      kind: kindDraft,
      thought: thoughtDraft.trim() || card.thought,
      quote: quoteDraft.trim(),
      pageStart: parseNullableNumber(pageStartDraft),
      pageEnd: parseNullableNumber(pageEndDraft),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setKindDraft(card.kind);
    setThoughtDraft(card.thought);
    setQuoteDraft(card.quote ?? "");
    setPageStartDraft(card.pageStart == null ? "" : String(card.pageStart));
    setPageEndDraft(card.pageEnd == null ? "" : String(card.pageEnd));
    setIsEditing(false);
  };

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
            라이브러리로 돌아가기
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
            <p className="mt-0.5 text-xs text-muted-foreground">{card.bookAuthor}</p>
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
        {isEditing ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">카드 타입</label>
              <select
                value={kindDraft}
                onChange={(event) =>
                  setKindDraft(event.target.value as CardNodeData["kind"])
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
              >
                {KIND_OPTIONS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">시작 페이지</label>
                <input
                  value={pageStartDraft}
                  onChange={(event) => setPageStartDraft(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
                  placeholder="예: 12"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">끝 페이지</label>
                <input
                  value={pageEndDraft}
                  onChange={(event) => setPageEndDraft(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
                  placeholder="예: 13"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            내 생각
          </h3>
          {isEditing ? (
            <textarea
              value={thoughtDraft}
              onChange={(event) => setThoughtDraft(event.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
              placeholder="카드 핵심 생각을 입력하세요."
            />
          ) : (
            <p className="text-xl font-bold leading-normal">{card.thought}</p>
          )}

          {!isEditing && card.tags?.length ? (
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
            원문 인용
          </h3>
          {isEditing ? (
            <textarea
              value={quoteDraft}
              onChange={(event) => setQuoteDraft(event.target.value)}
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2 font-serif italic"
              placeholder="원문 인용을 입력하세요."
            />
          ) : (
            <p className="text-base leading-relaxed italic text-muted-foreground font-serif">
              {card.quote?.trim() ? card.quote : "인용구 없음"}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-muted/20 p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            카드 내용 수정
          </button>
        )}

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
