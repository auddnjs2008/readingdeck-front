"use client";

import { useCallback, type DragEvent as ReactDragEvent } from "react";
import type { DeckSidebarBookItem, DeckSidebarCardItem } from "../types";

const DND_NODE_MIME = "application/readingdeck-node";

type DragBookPayload = {
  kind: "book";
  item: DeckSidebarBookItem;
};

type DragCardPayload = {
  kind: "card";
  item: DeckSidebarCardItem;
};

type DragPayload = DragBookPayload | DragCardPayload;

type UseDeckNodeDndParams = {
  onDropBook: (book: DeckSidebarBookItem, position: { x: number; y: number }) => void;
  onDropCard: (card: DeckSidebarCardItem, position: { x: number; y: number }) => void;
  getFlowPosition: (point: { x: number; y: number }) => { x: number; y: number } | null;
  fallbackPosition?: { x: number; y: number };
};

export function useDeckNodeDnd({
  onDropBook,
  onDropCard,
  getFlowPosition,
  fallbackPosition = { x: 360, y: 260 },
}: UseDeckNodeDndParams) {
  const onBookDragStart = useCallback(
    (book: DeckSidebarBookItem, event: ReactDragEvent) => {
      const payload: DragBookPayload = { kind: "book", item: book };
      event.dataTransfer.setData(DND_NODE_MIME, JSON.stringify(payload));
      event.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const onCardDragStart = useCallback(
    (card: DeckSidebarCardItem, event: ReactDragEvent) => {
      const payload: DragCardPayload = { kind: "card", item: card };
      event.dataTransfer.setData(DND_NODE_MIME, JSON.stringify(payload));
      event.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const onCanvasDragOver = useCallback((event: ReactDragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onCanvasDrop = useCallback(
    (event: ReactDragEvent<HTMLElement>) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData(DND_NODE_MIME);
      if (!raw) return;

      let payload: DragPayload | null = null;
      try {
        payload = JSON.parse(raw) as DragPayload;
      } catch {
        return;
      }
      if (!payload) return;

      const flowPosition = getFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const position = flowPosition ?? fallbackPosition;

      if (payload.kind === "book") {
        onDropBook(payload.item, position);
        return;
      }

      onDropCard(payload.item, position);
    },
    [fallbackPosition, getFlowPosition, onDropBook, onDropCard]
  );

  return {
    onBookDragStart,
    onCardDragStart,
    onCanvasDragOver,
    onCanvasDrop,
  };
}

