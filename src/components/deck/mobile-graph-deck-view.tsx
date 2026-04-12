"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type NodeId = string | number;

export type MobileGraphPreviewNode = {
  id: NodeId;
  x: number;
  y: number;
  type: "book" | "card";
};

export type MobileGraphPreviewEdge = {
  id: string | number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  fromNodeId: NodeId;
  toNodeId: NodeId;
};

export type MobileGraphDeckEntry = {
  id: NodeId;
  type: "book" | "card";
  title: string;
  secondary?: string | null;
  meta?: string | null;
  quote?: string | null;
  badgeLabel?: string | null;
  badgeClass?: string | null;
};

type MobileGraphDeckViewProps = {
  modeLabel: string;
  statusLabel?: string | null;
  title: string;
  description?: string | null;
  entries: MobileGraphDeckEntry[];
  previewNodes: MobileGraphPreviewNode[];
  previewEdges: MobileGraphPreviewEdge[];
  initialSelectedId?: NodeId | null;
  emptyMessage?: string;
};

export default function MobileGraphDeckView({
  modeLabel,
  statusLabel,
  title,
  description,
  entries,
  previewNodes,
  previewEdges,
  initialSelectedId,
  emptyMessage = "그래프를 미리 볼 수 있는 카드가 없습니다.",
}: MobileGraphDeckViewProps) {
  const [selectedId, setSelectedId] = useState<NodeId | null>(
    initialSelectedId ?? entries[0]?.id ?? previewNodes[0]?.id ?? null
  );
  const [showAllCards, setShowAllCards] = useState(false);

  const entryById = useMemo(
    () => new Map(entries.map((entry) => [entry.id, entry])),
    [entries]
  );

  const resolvedSelectedId =
    selectedId ?? entries[0]?.id ?? previewNodes[0]?.id ?? null;

  const selectedEntry = resolvedSelectedId
    ? entryById.get(resolvedSelectedId) ?? null
    : null;

  const relatedIds = useMemo(() => {
    if (resolvedSelectedId == null) return new Set<NodeId>();

    return new Set(
      previewEdges.flatMap((edge) => {
        if (edge.fromNodeId === resolvedSelectedId) return [edge.toNodeId];
        if (edge.toNodeId === resolvedSelectedId) return [edge.fromNodeId];
        return [];
      })
    );
  }, [previewEdges, resolvedSelectedId]);

  const relatedEntries = entries.filter((entry) => relatedIds.has(entry.id));
  const cardEntries = entries.filter((entry) => entry.type === "card");

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_8px_24px_rgba(63,54,49,0.06)]">
        <div className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(184,115,51,0.12),transparent_42%),linear-gradient(180deg,rgba(250,246,242,0.6),transparent)] px-5 py-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              {modeLabel}
            </span>
            {statusLabel ? (
              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                {statusLabel}
              </span>
            ) : null}
            <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              카드 {cardEntries.length}개
            </span>
          </div>

          <h1 className="text-[2rem] font-bold tracking-tight font-serif">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="p-5">
          {previewNodes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[22px] border border-border bg-background">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-base font-semibold">지식 구조</h2>
              </div>
              <div className="relative aspect-square bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px]">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {previewEdges.map((edge) => {
                    const isSelectedEdge =
                      resolvedSelectedId !== null &&
                      (edge.fromNodeId === resolvedSelectedId ||
                        edge.toNodeId === resolvedSelectedId);

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
                          resolvedSelectedId !== null && !isSelectedEdge
                            ? 0.24
                            : 0.58
                        }
                      />
                    );
                  })}
                  {previewNodes.map((node) => {
                    const isSelected = resolvedSelectedId === node.id;
                    const isRelated = relatedIds.has(node.id);

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
                              resolvedSelectedId !== null &&
                              !isSelected &&
                              !isRelated
                                ? 0.35
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
                            resolvedSelectedId !== null &&
                            !isSelected &&
                            !isRelated
                              ? 0.42
                              : 0.94
                          }
                          className="cursor-pointer transition-all"
                          onClick={() => setSelectedId(node.id)}
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
          )}
        </div>
      </section>

      <section className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-[0_8px_24px_rgba(63,54,49,0.06)]">
        <h2 className="text-base font-semibold">
          {selectedEntry?.type === "book" ? "선택한 책" : "선택한 카드"}
        </h2>

        {selectedEntry ? (
          <div className="mt-4 space-y-4">
            {selectedEntry.badgeLabel ? (
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  selectedEntry.badgeClass ??
                  "border-border/60 bg-muted/50 text-muted-foreground"
                }`}
              >
                {selectedEntry.badgeLabel}
              </span>
            ) : null}

            <p className="whitespace-pre-line text-[15px] font-semibold leading-8 text-foreground">
              {selectedEntry.title}
            </p>

            {selectedEntry.quote ? (
              <blockquote className="border-l-2 border-primary/40 pl-4 whitespace-pre-line text-sm italic leading-relaxed text-muted-foreground">
                &ldquo;{selectedEntry.quote}&rdquo;
              </blockquote>
            ) : null}

            {selectedEntry.secondary ? (
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {selectedEntry.secondary}
              </p>
            ) : null}

            {selectedEntry.meta ? (
              <p className="text-sm text-muted-foreground">
                {selectedEntry.meta}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            노드를 눌러 내용을 읽어보세요.
          </p>
        )}
      </section>

      {relatedEntries.length > 0 ? (
        <section className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-[0_8px_24px_rgba(63,54,49,0.06)]">
          <h2 className="text-base font-semibold">연결된 카드</h2>
          <div className="mt-4 space-y-3">
            {relatedEntries.map((entry) => (
              <button
                key={String(entry.id)}
                type="button"
                onClick={() => setSelectedId(entry.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  resolvedSelectedId === entry.id
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-background hover:border-primary/20"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {entry.badgeLabel ? (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        entry.badgeClass ??
                        "border-border/60 bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {entry.badgeLabel}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground">
                  {entry.title}
                </p>
                {entry.secondary ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {entry.secondary}
                  </p>
                ) : null}
                {entry.meta ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {entry.meta}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {cardEntries.length > 1 ? (
        <section className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-[0_8px_24px_rgba(63,54,49,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">전체 카드</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCards((prev) => !prev)}
            >
              {showAllCards ? "접기" : `카드 ${cardEntries.length}개 보기`}
            </Button>
          </div>

          {showAllCards ? (
            <div className="mt-4 space-y-3">
              {cardEntries.map((entry, index) => (
                <button
                  key={String(entry.id)}
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    resolvedSelectedId === entry.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-background hover:border-primary/20"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {entry.badgeLabel ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          entry.badgeClass ??
                          "border-border/60 bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {entry.badgeLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-foreground">
                    {entry.title}
                  </p>
                  {entry.secondary ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {entry.secondary}
                    </p>
                  ) : null}
                  {entry.meta ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {entry.meta}
                    </p>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
