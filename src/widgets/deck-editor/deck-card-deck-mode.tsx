"use client";

import Image from "next/image";
import * as React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
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
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">카드 {cards.length}개</p>
            </div>
            {draftSummary?.isDraft ? (
              <Button type="button" variant="ghost" className="shrink-0 rounded-[6px]! text-muted-foreground" onClick={draftSummary.onOpenMeta}>
                <PencilLine className="mr-2 h-4 w-4" />
                덱 정보
              </Button>
            ) : null}
          </div>

          {cards.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center py-12 text-center">
              <p className="font-serif text-xl text-foreground">
                아직 담긴 카드가 없습니다.
              </p>
              {emptyStateHint !== DEFAULT_EMPTY_HINT ? <p className="mt-2 text-sm text-muted-foreground">
                {emptyStateHint}
              </p> : null}
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
  const [expanded, setExpanded] = React.useState(false);
  const contentId = React.useId();
  const isSelected = selectedCardNodeId === card.nodeId;
  const hasTitle = Boolean(card.title?.trim());
  const toolClassName = "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <article
      aria-label={`카드 ${index + 1}`}
      className={`min-w-0 border-b border-border/70 py-6 [overflow-wrap:anywhere] ${isDragSource ? "bg-muted/30 opacity-70" : ""}`}
    >
      <div className="mb-4 flex items-center gap-1">
        {card.nodeId ? (
          <button
            type="button"
            ref={dragHandleRef}
            className={`${toolClassName} touch-none cursor-grab active:cursor-grabbing`}
            title="드래그하여 순서 변경"
            aria-label="카드 순서 드래그 핸들"
          >
            <GripVertical className="size-4" />
          </button>
        ) : null}
        <span className="ml-1 text-xs tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`ml-3 text-xs font-medium ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
          {kindLabel[card.kind]}
        </span>
        {card.isMock ? <span className="ml-2 text-xs text-muted-foreground">MOCK</span> : null}
        <div className="ml-auto flex shrink-0 items-center">
          <button
            type="button"
            className={toolClassName}
            onClick={() => { if (card.nodeId) onMoveCard(card.nodeId, "up"); }}
            disabled={!card.nodeId || index === 0}
            title="위로 이동"
            aria-label="위로 이동"
          >
            <ArrowUp className="size-4" />
          </button>
          <button
            type="button"
            className={toolClassName}
            onClick={() => { if (card.nodeId) onMoveCard(card.nodeId, "down"); }}
            disabled={!card.nodeId || index === total - 1}
            title="아래로 이동"
            aria-label="아래로 이동"
          >
            <ArrowDown className="size-4" />
          </button>
          <button
            type="button"
            className={`${toolClassName} hover:text-destructive`}
            onClick={() => { if (card.nodeId) onRemoveCard(card.nodeId); }}
            disabled={!card.nodeId}
            title="덱에서 카드 제거"
            aria-label="덱에서 카드 제거"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full min-w-0 items-start gap-4 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-describedby={`${contentId}-thought`}
        aria-label={`카드 ${index + 1} ${expanded ? "접기" : "펼치기"}`}
        onClick={() => {
          setExpanded((previous) => !previous);
          if (card.nodeId) onSelectCard(card.nodeId);
        }}
      >
        <span className="min-w-0 flex-1">
          {hasTitle ? (
            <span className={`mb-2 text-sm font-semibold ${expanded ? "block" : "line-clamp-1"}`}>{card.title}</span>
          ) : null}
          <span id={`${contentId}-thought`} className={`whitespace-pre-line font-serif text-lg leading-8 text-foreground ${expanded ? "block" : "line-clamp-3"}`}>
            {card.thought}
          </span>
        </span>
        <ChevronDown className={`mt-1.5 size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <div id={contentId} hidden={!expanded}>
        {card.quote ? (
          <blockquote className="mt-5 border-l-2 border-primary/30 pl-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">원문 인용</p>
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{card.quote}</p>
          </blockquote>
        ) : null}
      </div>
      <div className="mt-5 flex items-center gap-3">
        {card.bookCover ? (
          <div className="relative h-10 w-7 shrink-0 overflow-hidden bg-muted/20">
            <Image src={card.bookCover} alt={card.bookTitle} fill className="object-contain" sizes="28px" />
          </div>
        ) : null}
        <div className="min-w-0 text-xs leading-5 text-muted-foreground">
          <p>{[card.bookTitle, card.bookAuthor].filter(Boolean).join(" · ")}</p>
          {card.meta ? <p>{card.meta}</p> : null}
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
