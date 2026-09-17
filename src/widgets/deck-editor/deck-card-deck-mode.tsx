"use client";

import Image from "next/image";
import * as React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  PencilLine,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { CardNodeData } from "./types";

export type DeckModeCardItem = {
  id: string;
  nodeId?: string;
  kind: CardNodeData["kind"];
  title?: string | null;
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
  emptyStateHint?: string;
  draftSummary?: {
    isDraft: boolean;
    onOpenMeta: () => void;
  };
};

const kindLabel: Record<CardNodeData["kind"], string> = {
  Insight: "인사이트", Change: "변화", Action: "실천", Question: "질문", Quote: "인용",
};

const DEFAULT_EMPTY_HINT = "아직 담긴 카드가 없습니다.";

export default function DeckCardDeckMode({
  cards,
  selectedCardNodeId,
  onSelectCard,
  onMoveCard,
  onReorderCards,
  onRemoveCard,
  emptyStateHint = DEFAULT_EMPTY_HINT,
  draftSummary,
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
        <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-8 sm:px-10 sm:pt-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl">덱에 담긴 생각</h2>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{cards.length}개의 카드</p>
            </div>
            {draftSummary?.isDraft ? (
              <Button type="button" variant="ghost" className="shrink-0 rounded-md text-muted-foreground" onClick={draftSummary.onOpenMeta}>
                <PencilLine className="mr-2 h-4 w-4" />
                덱 정보
              </Button>
            ) : null}
          </div>

          {cards.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center py-12 text-center">
              <p className="font-serif text-xl text-foreground">
                아직 담긴 생각이 없어요
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {emptyStateHint}
              </p>
            </div>
          ) : (
            <DragDropProvider onDragEnd={handleDragEnd}>
              <div className="space-y-0">
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

                  const sortableCard = card as DeckModeCardItem & {
                    nodeId: string;
                  };
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
  const hasTitle = Boolean(card.title?.trim());
  const thoughtClassName = isSelected
    ? "whitespace-pre-line font-serif text-lg leading-relaxed text-foreground"
    : "line-clamp-3 whitespace-pre-line font-serif text-lg leading-relaxed text-foreground";
  const quoteClassName = isSelected
    ? "mt-4 border-l-2 border-primary/30 pl-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
    : "mt-4 border-l-2 border-primary/30 pl-3 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground";

  return (
    <article
      className={`border-b border-border py-6 transition-colors ${
        isSelected
          ? "bg-primary/[0.04]"
          : "hover:bg-muted/20"
      } ${card.nodeId ? "cursor-pointer hover:border-primary/35" : ""} ${
        isDragSource ? "opacity-70" : ""
      }`}
      tabIndex={card.nodeId ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          if (card.nodeId) onSelectCard(card.nodeId);
        }
      }}
      onClick={() => {
        if (card.nodeId) onSelectCard(card.nodeId);
      }}
    >
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="text-xs font-medium text-primary"
              >
                <span className="mr-3 font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{kindLabel[card.kind]}
              </span>
              {card.isMock ? (
                <span className="rounded-md border border-amber-500/35 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                  MOCK
                </span>
              ) : null}
            </div>
            {hasTitle ? (
              <p className="mb-1 line-clamp-1 text-sm font-bold text-foreground">
                {card.title}
              </p>
            ) : null}
            <h3 className={thoughtClassName}>{card.thought}</h3>
            {card.quote ? (
              <p className={quoteClassName}>
                &quot;{card.quote}&quot;
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              {card.bookTitle} · {card.bookAuthor}
              {card.meta ? ` · ${card.meta}` : ""}
            </p>
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center justify-between gap-3 xl:w-auto xl:flex-col">
          <div className="relative h-14 w-10 overflow-hidden rounded border border-border bg-muted/40">
            {card.bookCover ? (
              <Image
                src={card.bookCover}
                alt={card.bookTitle}
                fill
                className="object-contain"
                sizes="40px"
              />
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted/70 hover:text-foreground disabled:opacity-40"
              onClick={(event) => {
                event.stopPropagation();
                if (!card.nodeId) return;
                onMoveCard(card.nodeId, "up");
              }}
              disabled={!card.nodeId || index === 0}
              aria-label="위로 이동"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted/70 hover:text-foreground disabled:opacity-40"
              onClick={(event) => {
                event.stopPropagation();
                if (!card.nodeId) return;
                onMoveCard(card.nodeId, "down");
              }}
              disabled={!card.nodeId || index === total - 1}
              aria-label="아래로 이동"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md text-destructive transition hover:bg-destructive/10 disabled:opacity-40"
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
            {card.nodeId ? (
              <button
                type="button"
                ref={dragHandleRef}
                className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
                onClick={(event) => event.stopPropagation()}
                aria-label="카드 순서 드래그 핸들"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            ) : null}
          </div>
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
