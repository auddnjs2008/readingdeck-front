"use client";

import Image from "next/image";
import * as React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import { ChevronLeft, ChevronRight, GripVertical, Play, Trash2, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { CardNodeData } from "./types";

export type DeckModeCardItem = {
  id: string;
  nodeId?: string;
  kind: CardNodeData["kind"];
  thought: string;
  quote?: string;
  meta?: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  isMock?: boolean;
};

type Props = {
  cards: DeckModeCardItem[];
  selectedCardNodeId: string | null;
  onSelectCard: (nodeId: string) => void;
  onMoveCard: (nodeId: string, direction: "up" | "down") => void;
  onReorderCards: (orderedNodeIds: string[]) => void;
  onRemoveCard: (nodeId: string) => void;
  onOpenPreview: () => void;
};

const kindLabel: Record<CardNodeData["kind"], string> = {
  Insight: "INSIGHT",
  Change: "CHANGE",
  Action: "ACTION",
  Question: "QUESTION",
  Quote: "QUOTE",
};

const kindChipClass: Record<CardNodeData["kind"], string> = {
  Insight:
    "text-emerald-700 bg-emerald-600/10 border-emerald-600/30 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  Question:
    "text-rose-700 bg-rose-600/10 border-rose-600/30 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20",
  Change:
    "text-orange-700 bg-orange-600/10 border-orange-600/30 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
  Action:
    "text-sky-700 bg-sky-600/10 border-sky-600/30 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
  Quote:
    "text-sky-700 bg-sky-600/10 border-sky-600/30 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
};

export default function DeckCardDeckMode({
  cards,
  selectedCardNodeId,
  onSelectCard,
  onMoveCard,
  onReorderCards,
  onRemoveCard,
  onOpenPreview,
}: Props) {
  const sortableCards = React.useMemo(
    () => cards.filter((card): card is DeckModeCardItem & { nodeId: string } => Boolean(card.nodeId)),
    [cards]
  );

  const sortableCardIds = React.useMemo(
    () => sortableCards.map((card) => card.nodeId),
    [sortableCards]
  );

  const handleDragEnd = React.useCallback<
    NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragEnd"]>
  >(
    (event) => {
      if (event.canceled) return;
      if (!isSortableOperation(event.operation)) return;

      const source = event.operation.source;
      if (!source) return;

      const sourceId = source.id;
      const sourceKey = String(sourceId);

      const fromIndexFromOperation = source.sortable.initialIndex;
      const toIndexFromOperation = source.sortable.index;

      const fromIndex =
        fromIndexFromOperation >= 0 &&
        fromIndexFromOperation < sortableCardIds.length &&
        sortableCardIds[fromIndexFromOperation] === sourceKey
          ? fromIndexFromOperation
          : sortableCardIds.indexOf(sourceKey);

      const toIndex = Math.max(
        0,
        Math.min(sortableCardIds.length - 1, toIndexFromOperation)
      );

      if (fromIndex < 0 || toIndex < 0) return;
      if (fromIndex === toIndex) return;

      const next = [...sortableCardIds];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      onReorderCards(next);
    },
    [onReorderCards, sortableCardIds]
  );

  return (
    <section className="min-h-0 flex-1 bg-background">
      <ScrollArea className="h-full">
        <div className="mx-auto w-full max-w-4xl p-6 pt-20">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Deck Mode
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">
              카드 덱 빌더
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              사이드바에서 카드를 추가하면 발표 순서대로 쌓입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={cards.length === 0}
          >
            <Play className="h-4 w-4" />
            발표 미리보기
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            아직 추가된 카드가 없습니다. 우측 사이드바에서 카드를 선택해
            덱을 구성해보세요.
          </div>
        ) : (
          <DragDropProvider onDragEnd={handleDragEnd}>
            <div className="space-y-4">
              {cards.map((card, index) => {
                if (!card.nodeId) {
                  return (
                    <DeckCardItem
                      key={card.id}
                      card={card}
                      index={index}
                      total={cards.length}
                      selectedCardNodeId={selectedCardNodeId}
                      onSelectCard={onSelectCard}
                      onMoveCard={onMoveCard}
                      onRemoveCard={onRemoveCard}
                    />
                  );
                }

                const sortableCard = card as DeckModeCardItem & { nodeId: string };
                return (
                  <SortableDeckCardItem
                    key={card.id}
                    card={sortableCard}
                    index={index}
                    total={cards.length}
                    selectedCardNodeId={selectedCardNodeId}
                    onSelectCard={onSelectCard}
                    onMoveCard={onMoveCard}
                    onRemoveCard={onRemoveCard}
                  />
                );
              })}
            </div>
          </DragDropProvider>
        )}
        </div>
      </ScrollArea>
    </section>
  );
}

type DeckCardItemProps = {
  card: DeckModeCardItem;
  index: number;
  total: number;
  selectedCardNodeId: string | null;
  onSelectCard: (nodeId: string) => void;
  onMoveCard: (nodeId: string, direction: "up" | "down") => void;
  onRemoveCard: (nodeId: string) => void;
  dragHandleRef?: (element: Element | null) => void;
  isDragSource?: boolean;
};

function DeckCardItem({
  card,
  index,
  total,
  selectedCardNodeId,
  onSelectCard,
  onMoveCard,
  onRemoveCard,
  dragHandleRef,
  isDragSource = false,
}: DeckCardItemProps) {
  const isSelected = selectedCardNodeId === card.nodeId;

  return (
    <article
      className={`rounded-xl border bg-card p-4 transition ${
        isSelected
          ? "border-primary/35 bg-primary/[0.04]"
          : "border-border hover:border-primary/20"
      } ${card.nodeId ? "cursor-pointer hover:border-primary/35" : ""} ${
        isDragSource ? "opacity-70" : ""
      }`}
      onClick={() => {
        if (card.nodeId) onSelectCard(card.nodeId);
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${kindChipClass[card.kind]}`}
              >
                {kindLabel[card.kind]}
              </span>
              {card.isMock ? (
                <span className="rounded-md border border-amber-500/35 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                  MOCK
                </span>
              ) : null}
            </div>
            <h3 className="line-clamp-2 text-base font-semibold text-foreground">
              {card.thought}
            </h3>
            {card.quote ? (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                &quot;{card.quote}&quot;
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              {card.bookTitle} · {card.bookAuthor}
              {card.meta ? ` · ${card.meta}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="relative h-14 w-10 overflow-hidden rounded border border-border bg-muted/40">
            {card.bookCover ? (
              <Image
                src={card.bookCover}
                alt={card.bookTitle}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              onClick={(event) => {
                event.stopPropagation();
                if (!card.nodeId) return;
                onMoveCard(card.nodeId, "up");
              }}
              disabled={!card.nodeId || index === 0}
            >
              위로
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              onClick={(event) => {
                event.stopPropagation();
                if (!card.nodeId) return;
                onMoveCard(card.nodeId, "down");
              }}
              disabled={!card.nodeId || index === total - 1}
            >
              아래로
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-[11px] text-destructive transition hover:bg-destructive/20 disabled:opacity-40"
              onClick={(event) => {
                event.stopPropagation();
                if (!card.nodeId) return;
                onRemoveCard(card.nodeId);
              }}
              disabled={!card.nodeId}
              aria-label="카드 제거"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {card.nodeId ? (
            <button
              type="button"
              ref={dragHandleRef}
              className="rounded-md border border-border bg-background p-1.5 text-muted-foreground transition hover:text-foreground"
              onClick={(event) => event.stopPropagation()}
              aria-label="카드 순서 드래그 핸들"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type SortableDeckCardItemProps = Omit<DeckCardItemProps, "dragHandleRef" | "isDragSource"> & {
  card: DeckModeCardItem & { nodeId: string };
};

function SortableDeckCardItem({ card, ...props }: SortableDeckCardItemProps) {
  const { ref, sourceRef, targetRef, handleRef, isDragSource } = useSortable({
    id: card.nodeId,
    index: props.index,
    group: "deck-mode-cards",
  });

  return (
    <div
      ref={(element) => {
        ref(element);
        sourceRef(element);
        targetRef(element);
      }}
    >
      <DeckCardItem
        {...props}
        card={card}
        dragHandleRef={handleRef}
        isDragSource={isDragSource}
      />
    </div>
  );
}

type PreviewProps = {
  open: boolean;
  cards: DeckModeCardItem[];
  initialIndex?: number;
  onClose: () => void;
};

export function DeckPresentationPreview({
  open,
  cards,
  initialIndex = 0,
  onClose,
}: PreviewProps) {
  const safeCards = cards.length > 0 ? cards : [];
  const [index, setIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (!open) return;
    setIndex(initialIndex);
  }, [initialIndex, open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        setIndex((prev) => Math.min(prev + 1, safeCards.length - 1));
      } else if (event.key === "ArrowLeft") {
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open, safeCards.length]);

  if (!open || safeCards.length === 0) return null;

  const current = safeCards[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-md border border-border bg-background p-1.5 text-muted-foreground transition hover:text-foreground"
          onClick={onClose}
          aria-label="미리보기 닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center justify-between pr-10">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Presentation Preview
          </p>
          <p className="text-sm font-medium text-foreground">
            {index + 1} / {safeCards.length}
          </p>
        </div>

        <article className="rounded-xl border border-border bg-background/60 p-6">
          <div className="mb-3 text-xs font-semibold text-primary">
            {kindLabel[current.kind]}
          </div>
          <h3 className="text-2xl font-semibold leading-tight text-foreground">
            {current.thought}
          </h3>
          {current.quote ? (
            <p className="mt-4 text-base text-muted-foreground">
              &quot;{current.quote}&quot;
            </p>
          ) : null}
          <div className="mt-8 flex items-center gap-3 border-t border-border pt-4">
            <div className="relative h-14 w-10 overflow-hidden rounded border border-border bg-muted/40">
              {current.bookCover ? (
                <Image
                  src={current.bookCover}
                  alt={current.bookTitle}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : null}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{current.bookTitle}</p>
              <p className="text-xs text-muted-foreground">{current.bookAuthor}</p>
            </div>
          </div>
        </article>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </button>
          <button
            type="button"
            onClick={() => setIndex((prev) => Math.min(prev + 1, safeCards.length - 1))}
            disabled={index === safeCards.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
