"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, Book, BookOpen, Pencil, Trash2 } from "lucide-react";
import type { CardNodeData } from "./types";

type Props = {
  width: number;
  onWidthChange: (width: number) => void;
  card: CardNodeData;
  onBack: () => void;
  onDelete: () => void;
  onUpdate: (payload: {
    kind: CardNodeData["kind"];
    title: string;
    thought: string;
    quote: string;
    pageStart: number | null;
    pageEnd: number | null;
  }) => void;
};

const kindLabel: Record<CardNodeData["kind"], string> = {
  Insight: "인사이트", Change: "변화", Action: "실천", Question: "질문", Quote: "인용",
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
  width,
  onWidthChange,
  card,
  onBack,
  onDelete,
  onUpdate,
}: Props) {
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  const changeWidth = (nextWidth: number) =>
    onWidthChange(Math.max(320, Math.min(640, nextWidth)));
  const [isEditing, setIsEditing] = useState(false);
  const [kindDraft, setKindDraft] = useState<CardNodeData["kind"]>(card.kind);
  const [titleDraft, setTitleDraft] = useState(card.title ?? "");
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
      title: titleDraft.trim(),
      thought: thoughtDraft.trim() || card.thought,
      quote: quoteDraft.trim(),
      pageStart: parseNullableNumber(pageStartDraft),
      pageEnd: parseNullableNumber(pageEndDraft),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setKindDraft(card.kind);
    setTitleDraft(card.title ?? "");
    setThoughtDraft(card.thought);
    setQuoteDraft(card.quote ?? "");
    setPageStartDraft(card.pageStart == null ? "" : String(card.pageStart));
    setPageEndDraft(card.pageEnd == null ? "" : String(card.pageEnd));
    setIsEditing(false);
  };

  return (
    <aside
      className="relative flex h-full max-w-[60%] shrink-0 flex-col overflow-hidden border-l border-border bg-background"
      style={{ width }}
    >
      <div
        role="separator"
        aria-label="카드 상세 패널 너비"
        aria-orientation="vertical"
        aria-valuemin={320}
        aria-valuemax={640}
        aria-valuenow={width}
        tabIndex={0}
        title="드래그하여 너비 조절, 두 번 클릭하여 초기화"
        className="absolute inset-y-0 left-0 z-20 w-2 touch-none cursor-col-resize hover:bg-primary/20 focus-visible:bg-primary/20 focus-visible:outline-none"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          resizeStart.current = {
            x: event.clientX,
            width: event.currentTarget.parentElement?.getBoundingClientRect().width ?? width,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!resizeStart.current) return;
          changeWidth(resizeStart.current.width + resizeStart.current.x - event.clientX);
        }}
        onPointerUp={(event) => {
          resizeStart.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onLostPointerCapture={() => { resizeStart.current = null; }}
        onDoubleClick={() => changeWidth(380)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            changeWidth(width + (event.key === "ArrowLeft" ? 20 : -20));
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            changeWidth(event.key === "Home" ? 320 : 640);
          }
        }}
      />
      <div className="flex shrink-0 flex-col gap-4 border-b border-border p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            카드 목록
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDelete}
              aria-label="덱에서 카드 제거"
              title="덱에서 카드 제거"
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span
                className="text-xs font-medium text-primary"
              >
                {kindLabel[card.kind]}
              </span>
              <span className="text-xs text-muted-foreground">{card.meta}</span>
            </div>
            {card.title?.trim() ? (
              <p className="mb-1 text-sm font-semibold text-foreground">
                {card.title}
              </p>
            ) : null}
            <h2 className="text-sm font-semibold leading-tight">
              {card.bookTitle}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {card.bookAuthor}
            </p>
          </div>
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-border/50 bg-muted/30">
            {card.bookCover ? (
              <Image
                src={card.bookCover}
                alt={card.bookTitle}
                fill
                sizes="40px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                <Book className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
        {isEditing ? (
          <div className="space-y-3 rounded-md border border-border bg-background p-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                카드 타입
              </label>
              <select
                value={kindDraft}
                onChange={(event) =>
                  setKindDraft(event.target.value as CardNodeData["kind"])
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
              >
                {KIND_OPTIONS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kindLabel[kind]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                카드 제목
              </label>
              <input
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
                placeholder="카드 핵심을 한 줄로 적어보세요."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  시작 페이지
                </label>
                <input
                  value={pageStartDraft}
                  onChange={(event) => setPageStartDraft(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
                  placeholder="예: 12"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  끝 페이지
                </label>
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
          <h3 className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <BookOpen className="h-4 w-4" />내 생각
          </h3>
          {isEditing ? (
            <textarea
              value={thoughtDraft}
              onChange={(event) => setThoughtDraft(event.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif outline-none ring-primary/30 transition focus:ring-2"
              placeholder="카드 핵심 생각을 입력하세요."
            />
          ) : (
            <p className="whitespace-pre-line font-serif text-lg leading-relaxed">
              {card.thought}
            </p>
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

        <div className="border-l-2 border-primary/30 pl-4">
          <h3 className="mb-3 text-xs font-bold text-muted-foreground">
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
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground font-serif">
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            카드 내용 수정
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="h-4 w-4" />
          덱에서 삭제
        </button>
      </div>
    </aside>
  );
}
