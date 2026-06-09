import { useMemo, useState } from "react";

import type { ResGetDeckDetail } from "@/entities/deck/api/getDeckDetail";
import {
  buildGraphPreview,
  CARD_BADGE_CLASSES,
  CARD_LABELS,
  formatPageRange,
  getOrderedCardNodes,
} from "@/entities/deck/lib/deck-read-viewer";
import { Button } from "@/shared/ui/button";

type DeckReadGraphViewProps = {
  deck: ResGetDeckDetail;
  onListViewClick: () => void;
};

export function DeckReadGraphView({
  deck,
  onListViewClick,
}: DeckReadGraphViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const orderedCardNodes = useMemo(
    () => getOrderedCardNodes(deck.nodes),
    [deck.nodes]
  );
  const graphPreview = useMemo(
    () => buildGraphPreview(deck.nodes, deck.connections),
    [deck.connections, deck.nodes]
  );
  const resolvedSelectedNodeId =
    selectedNodeId ?? orderedCardNodes[0]?.id ?? deck.nodes[0]?.id ?? null;

  const selectedNode = useMemo(() => {
    if (!resolvedSelectedNodeId) return null;
    return deck.nodes.find((node) => node.id === resolvedSelectedNodeId) ?? null;
  }, [deck.nodes, resolvedSelectedNodeId]);

  const relatedNodeIds = useMemo(() => {
    if (!resolvedSelectedNodeId) return new Set<number>();

    return new Set(
      deck.connections.flatMap((connection) => {
        if (connection.fromNodeId === resolvedSelectedNodeId) {
          return [connection.toNodeId];
        }

        if (connection.toNodeId === resolvedSelectedNodeId) {
          return [connection.fromNodeId];
        }

        return [];
      })
    );
  }, [deck.connections, resolvedSelectedNodeId]);

  if (graphPreview.nodes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
        그래프 미리보기를 만들 수 있는 노드가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
      <div className="overflow-hidden rounded-[24px] border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">지식 구조 보기</h2>
        </div>
        <div className="relative aspect-[16/10] min-h-[340px] bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[18px_18px]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {graphPreview.edges.map((edge) => {
              const isSelectedEdge =
                resolvedSelectedNodeId !== null &&
                (edge.fromNodeId === resolvedSelectedNodeId ||
                  edge.toNodeId === resolvedSelectedNodeId);

              return (
                <line
                  key={edge.id}
                  x1={edge.sx}
                  y1={edge.sy}
                  x2={edge.tx}
                  y2={edge.ty}
                  stroke={
                    isSelectedEdge
                      ? "var(--color-primary)"
                      : "var(--color-muted-foreground)"
                  }
                  strokeWidth={isSelectedEdge ? 1.8 : 1.1}
                  strokeLinecap="round"
                  opacity={
                    resolvedSelectedNodeId !== null && !isSelectedEdge
                      ? 0.25
                      : 0.6
                  }
                />
              );
            })}
            {graphPreview.nodes.map((node) => {
              const isSelected = resolvedSelectedNodeId === node.id;
              const isRelated = relatedNodeIds.has(node.id);

              return (
                <g key={node.id}>
                  {node.type === "book" ? (
                    <rect
                      x={node.x - (isSelected ? 3.4 : isRelated ? 2.8 : 2.2)}
                      y={node.y - (isSelected ? 3.4 : isRelated ? 2.8 : 2.2)}
                      width={isSelected ? 6.8 : isRelated ? 5.6 : 4.4}
                      height={isSelected ? 6.8 : isRelated ? 5.6 : 4.4}
                      rx="1.6"
                      fill="var(--color-primary)"
                      opacity={
                        resolvedSelectedNodeId !== null &&
                        !isSelected &&
                        !isRelated
                          ? 0.4
                          : 0.18
                      }
                    />
                  ) : null}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={
                      isSelected
                        ? node.type === "book"
                          ? 4
                          : 3.6
                        : isRelated
                          ? node.type === "book"
                            ? 3.2
                            : 2.8
                          : node.type === "book"
                            ? 2.1
                            : 1.7
                    }
                    fill={
                      node.type === "book"
                        ? "var(--color-primary)"
                        : "var(--color-foreground)"
                    }
                    opacity={
                      resolvedSelectedNodeId !== null && !isSelected && !isRelated
                        ? 0.45
                        : 0.94
                    }
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedNodeId(node.id)}
                  />
                  {isSelected ? (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.type === "book" ? 5.5 : 5}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="0.8"
                      opacity="0.7"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <SelectedNodePanel
        selectedNode={selectedNode}
        onListViewClick={onListViewClick}
      />
    </div>
  );
}

function SelectedNodePanel({
  selectedNode,
  onListViewClick,
}: {
  selectedNode: ResGetDeckDetail["nodes"][number] | null;
  onListViewClick: () => void;
}) {
  return (
    <aside className="rounded-[24px] border border-border bg-background px-5 py-5">
      {selectedNode ? (
        <>
          {selectedNode.type === "card" && selectedNode.card ? (
            <SelectedCardNode selectedNode={selectedNode} />
          ) : (
            <SelectedBookNode selectedNode={selectedNode} />
          )}

          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={onListViewClick}
          >
            카드 목록으로 보기
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          노드를 눌러 내용을 읽어보세요.
        </p>
      )}
    </aside>
  );
}

function SelectedCardNode({
  selectedNode,
}: {
  selectedNode: ResGetDeckDetail["nodes"][number];
}) {
  if (!selectedNode.card) return null;

  return (
    <>
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
          CARD_BADGE_CLASSES[selectedNode.card.type] ??
          "border-border/60 bg-muted/50 text-muted-foreground"
        }`}
      >
        {CARD_LABELS[selectedNode.card.type] ?? selectedNode.card.type}
      </span>

      {selectedNode.card.title?.trim() ? (
        <p className="mt-4 text-sm font-bold text-foreground">
          {selectedNode.card.title}
        </p>
      ) : null}

      <p className="mt-4 whitespace-pre-line text-base font-semibold leading-7 text-foreground">
        {selectedNode.card.thought}
      </p>

      {selectedNode.card.quote ? (
        <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 whitespace-pre-line text-sm italic leading-relaxed text-muted-foreground">
          &ldquo;{selectedNode.card.quote}&rdquo;
        </blockquote>
      ) : null}

      {selectedNode.book?.title ||
      formatPageRange(selectedNode.card.pageStart, selectedNode.card.pageEnd) ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {[
            selectedNode.book?.title
              ? `${selectedNode.book.title}${
                  selectedNode.book.author ? ` · ${selectedNode.book.author}` : ""
                }`
              : null,
            formatPageRange(selectedNode.card.pageStart, selectedNode.card.pageEnd),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : null}
    </>
  );
}

function SelectedBookNode({
  selectedNode,
}: {
  selectedNode: ResGetDeckDetail["nodes"][number];
}) {
  return (
    <>
      <h3 className="text-xl font-semibold font-serif text-foreground">
        {selectedNode.book?.title ?? "책 정보 없음"}
      </h3>
      {selectedNode.book?.author ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {selectedNode.book.author}
        </p>
      ) : null}
    </>
  );
}
