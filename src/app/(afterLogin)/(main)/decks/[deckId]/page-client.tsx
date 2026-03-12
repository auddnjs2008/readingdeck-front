"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  ArrowLeft,
  BookOpenText,
  GitBranch,
  Network,
  Orbit,
  PenSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeckDetailQuery } from "@/hooks/deck/react-query/useDeckDetailQuery";
import type { DeckGraphConnection, DeckGraphNode } from "@/service/deck/types";

type ReadView = "list" | "graph";

type GraphPreviewNode = {
  id: number;
  x: number;
  y: number;
  type: DeckGraphNode["type"];
};

type GraphPreviewEdge = {
  id: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  fromNodeId: number;
  toNodeId: number;
};

const CARD_LABELS: Record<string, string> = {
  insight: "Insight",
  change: "Change",
  action: "Action",
  question: "Question",
};

const CARD_BADGE_CLASSES: Record<string, string> = {
  insight:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  question:
    "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  change:
    "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  action:
    "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
};

const MODE_COPY = {
  graph: {
    label: "Graph deck",
    description:
      "연결 구조를 따라가며 생각의 흐름을 탐색하도록 설계된 덱입니다.",
  },
  list: {
    label: "List deck",
    description:
      "카드의 순서와 리듬을 따라 차분히 읽도록 설계된 덱입니다.",
  },
} as const;

const formatUpdatedAt = (updatedAt: string) =>
  dayjs(updatedAt).format("YYYY.MM.DD");

const formatPageRange = (pageStart: number | null, pageEnd: number | null) => {
  if (pageStart && pageEnd) return `p.${pageStart}-${pageEnd}`;
  if (pageStart) return `p.${pageStart}`;
  if (pageEnd) return `p.${pageEnd}`;
  return null;
};

const buildGraphPreview = (
  nodes: DeckGraphNode[],
  connections: DeckGraphConnection[]
): { nodes: GraphPreviewNode[]; edges: GraphPreviewEdge[] } => {
  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const minX = Math.min(...nodes.map((node) => node.positionX));
  const maxX = Math.max(...nodes.map((node) => node.positionX));
  const minY = Math.min(...nodes.map((node) => node.positionY));
  const maxY = Math.max(...nodes.map((node) => node.positionY));
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const normalizeX = (value: number) => 10 + ((value - minX) / width) * 80;
  const normalizeY = (value: number) => 12 + ((value - minY) / height) * 76;

  const normalizedNodes = nodes.map((node) => ({
    id: node.id,
    x: normalizeX(node.positionX),
    y: normalizeY(node.positionY),
    type: node.type,
  }));

  const nodeById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const normalizedEdges = connections
    .map((connection) => {
      const source = nodeById.get(connection.fromNodeId);
      const target = nodeById.get(connection.toNodeId);

      if (!source || !target) return null;

      return {
        id: connection.id,
        sx: source.x,
        sy: source.y,
        tx: target.x,
        ty: target.y,
        fromNodeId: connection.fromNodeId,
        toNodeId: connection.toNodeId,
      };
    })
    .filter((edge): edge is GraphPreviewEdge => edge !== null);

  return { nodes: normalizedNodes, edges: normalizedEdges };
};

export default function DeckReadPageClient() {
  const params = useParams<{ deckId: string }>();
  const router = useRouter();
  const parsedDeckId = Number(params?.deckId);
  const isValidDeckId = Number.isFinite(parsedDeckId) && parsedDeckId > 0;
  const [manualView, setManualView] = useState<ReadView | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const { data, isPending, isError } = useDeckDetailQuery(
    {
      path: { deckId: isValidDeckId ? parsedDeckId : 0 },
    },
    {
      enabled: isValidDeckId,
    }
  );

  const orderedCardNodes = useMemo(
    () =>
      (data?.nodes ?? [])
        .filter((node) => node.type === "card" && node.card)
        .sort((a, b) => a.order - b.order),
    [data?.nodes]
  );

  const graphPreview = useMemo(
    () => buildGraphPreview(data?.nodes ?? [], data?.connections ?? []),
    [data?.connections, data?.nodes]
  );

  const defaultView: ReadView = data?.mode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const resolvedSelectedNodeId =
    selectedNodeId ?? orderedCardNodes[0]?.id ?? data?.nodes[0]?.id ?? null;
  const deckMode = data?.mode ?? "list";
  const deckCopy = MODE_COPY[deckMode];
  const heroDescription =
    data?.description?.trim() ||
    (deckMode === "graph"
      ? "이 덱은 연결 구조를 읽기 위한 결과물입니다. 눈에 띄는 노드를 선택해 맥락을 따라가며 살펴보세요."
      : "이 덱은 순서대로 읽는 결과물입니다. 카드의 간격과 흐름을 따라가며 한 편의 독서 메모처럼 읽어보세요.");

  const selectedNode = useMemo(() => {
    if (!resolvedSelectedNodeId) return null;
    return (
      (data?.nodes ?? []).find((node) => node.id === resolvedSelectedNodeId) ??
      null
    );
  }, [data?.nodes, resolvedSelectedNodeId]);

  const relatedNodeIds = useMemo(() => {
    if (!resolvedSelectedNodeId) return new Set<number>();

    return new Set(
      (data?.connections ?? []).flatMap((connection) => {
        if (connection.fromNodeId === resolvedSelectedNodeId) {
          return [connection.toNodeId];
        }

        if (connection.toNodeId === resolvedSelectedNodeId) {
          return [connection.fromNodeId];
        }

        return [];
      })
    );
  }, [data?.connections, resolvedSelectedNodeId]);

  useEffect(() => {
    if (!data) return;

    if (data.status === "draft") {
      router.replace(`/decks/${data.id}/edit`);
      return;
    }

  }, [data, router]);

  if (!isValidDeckId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        잘못된 덱 주소입니다.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        덱을 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-destructive">
        덱을 불러오지 못했습니다.
      </div>
    );
  }

  if (data.status === "draft") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        편집 화면으로 이동하고 있습니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex items-center justify-between">
          <Link
            href="/decks"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />덱 목록으로
          </Link>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`/decks/${data.id}/edit`)}
          >
            <PenSquare className="h-4 w-4" />
            편집하기
          </Button>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_14px_40px_rgba(63,54,49,0.08)]">
          <div className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(184,115,51,0.12),transparent_42%),linear-gradient(180deg,rgba(250,246,242,0.6),transparent)] px-6 py-8 md:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Published
              </span>
              <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                {deckCopy.label}
              </span>
            </div>

            <h1 className="max-w-4xl text-3xl font-bold tracking-tight font-serif md:text-[2.5rem]">
              {data.name}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {heroDescription}
            </p>

            <div className="mt-5 max-w-3xl rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
              {deckCopy.description}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <BookOpenText className="h-4 w-4" />
                카드 {orderedCardNodes.length}개
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Network className="h-4 w-4" />
                노드 {data.nodes.length}개
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <GitBranch className="h-4 w-4" />
                연결 {data.connections.length}개
              </span>
              <span className="text-sm text-muted-foreground">
                마지막 수정 {formatUpdatedAt(data.updatedAt)}
              </span>
            </div>
          </div>

          <div className="border-b border-border px-6 py-4 md:px-8">
            {data.mode === "graph" ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    그래프 중심 덱
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    이 덱은 연결 구조를 탐색하며 읽도록 설계되었습니다.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setManualView("graph")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeView === "graph"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    그래프 읽기
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualView("list")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeView === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    카드 목록
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  리스트 중심 덱
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  이 덱은 카드의 순서와 흐름을 따라 읽도록 설계되었습니다.
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-8 md:px-8">
            {activeView === "list" ? (
              orderedCardNodes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
                  아직 순서대로 읽을 카드가 없습니다.
                </div>
              ) : (
                <div className="space-y-5">
                  {orderedCardNodes.map((node, index) => {
                    if (!node.card) return null;

                    const badgeClass =
                      CARD_BADGE_CLASSES[node.card.type] ??
                      "border-border/60 bg-muted/50 text-muted-foreground";
                    const pageRange = formatPageRange(
                      node.card.pageStart,
                      node.card.pageEnd
                    );

                    return (
                      <article
                        key={node.id}
                        className="rounded-[24px] border border-border bg-background px-5 py-5 shadow-[0_8px_24px_rgba(63,54,49,0.05)] transition-colors hover:border-primary/20 md:px-6 md:py-6"
                      >
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}
                          >
                            {CARD_LABELS[node.card.type] ?? node.card.type}
                          </span>
                        </div>

                        {node.card.quote ? (
                          <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 text-[17px] font-medium leading-8 text-foreground md:text-[19px]">
                            {node.card.quote}
                          </blockquote>
                        ) : null}

                        <p className="text-[15px] leading-8 text-foreground/90">
                          {node.card.thought}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {node.book?.title ? (
                            <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1.5">
                              {node.book.title}
                              {node.book.author ? ` · ${node.book.author}` : ""}
                            </span>
                          ) : null}
                          {pageRange ? (
                            <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1.5">
                              {pageRange}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : graphPreview.nodes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
                그래프 미리보기를 만들 수 있는 노드가 없습니다.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
                <div className="overflow-hidden rounded-[24px] border border-border bg-background">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold">지식 구조 보기</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      노드를 눌러 카드와 책 정보를 읽고, 연결 흐름을 따라가며
                      탐색할 수 있습니다.
                    </p>
                  </div>
                  <div className="relative aspect-[16/10] min-h-[340px] bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[18px_18px]">
                    {selectedNode ? (
                      <div className="absolute left-4 top-4 z-10 rounded-full border border-primary/20 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                        {selectedNode.type === "book"
                          ? "선택된 책 노드"
                          : "선택된 카드 중심으로 연결 보기"}
                      </div>
                    ) : null}
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
                                width={(isSelected ? 6.8 : isRelated ? 5.6 : 4.4)}
                                height={(isSelected ? 6.8 : isRelated ? 5.6 : 4.4)}
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
                                resolvedSelectedNodeId !== null &&
                                !isSelected &&
                                !isRelated
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
                            {(isSelected || isRelated) && node.type === "card" ? (
                              <text
                                x={node.x}
                                y={node.y - 4.8}
                                textAnchor="middle"
                                className="fill-foreground text-[3px] font-medium"
                              >
                                card
                              </text>
                            ) : null}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <aside className="rounded-[24px] border border-border bg-background px-5 py-5">
                  {selectedNode ? (
                    <>
                      <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {selectedNode.type === "book"
                            ? "Book node"
                            : "Selected card"}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold font-serif text-foreground">
                          {selectedNode.type === "book"
                            ? selectedNode.book?.title ?? "책 정보 없음"
                            : selectedNode.card?.quote ??
                              selectedNode.card?.thought ??
                              "카드 내용 없음"}
                        </h3>
                      </div>

                      {selectedNode.type === "card" && selectedNode.card ? (
                        <>
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                              CARD_BADGE_CLASSES[selectedNode.card.type] ??
                              "border-border/60 bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {CARD_LABELS[selectedNode.card.type] ??
                              selectedNode.card.type}
                          </span>

                          <p className="mt-4 text-sm leading-7 text-foreground/90">
                            {selectedNode.card.thought}
                          </p>

                          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                            {selectedNode.book?.title ? (
                              <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Related book
                                </p>
                                <p className="mt-2 font-medium text-foreground">
                                  {selectedNode.book.title}
                                  {selectedNode.book.author
                                    ? ` · ${selectedNode.book.author}`
                                    : ""}
                                </p>
                              </div>
                            ) : null}
                            {formatPageRange(
                              selectedNode.card.pageStart,
                              selectedNode.card.pageEnd
                            ) ? (
                              <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Page
                                </p>
                                <p className="mt-2 font-medium text-foreground">
                                  {formatPageRange(
                                    selectedNode.card.pageStart,
                                    selectedNode.card.pageEnd
                                  )}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm leading-7 text-muted-foreground">
                            책 노드는 이 그래프의 맥락을 잡아주는 기준점입니다.
                            연결된 카드 노드를 선택해 인사이트 흐름을 이어서
                            읽어보세요.
                          </p>
                          {selectedNode.book?.author ? (
                            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                              저자:{" "}
                              <span className="font-medium text-foreground">
                                {selectedNode.book.author}
                              </span>
                            </div>
                          ) : null}
                        </>
                      )}

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            연결 수
                          </p>
                          <p className="mt-1 text-2xl font-bold">
                            {relatedNodeIds.size}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            전체 카드
                          </p>
                          <p className="mt-1 text-2xl font-bold">
                            {orderedCardNodes.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-dashed border-border/70 bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
                        {selectedNode.type === "book"
                          ? "이 책을 기준으로 이어지는 카드 노드를 따라가며 덱의 큰 줄기를 읽어보세요."
                          : "연결 수가 높을수록 이 카드가 그래프 안에서 더 많은 맥락과 이어져 있다는 뜻입니다."}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-6 w-full"
                        onClick={() => setManualView("list")}
                      >
                        카드 목록으로 보기
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-semibold">읽기 안내</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        노드를 눌러 상세 내용을 읽어보세요. 선택된 노드를
                        기준으로 연결된 흐름이 함께 강조됩니다.
                      </p>
                    </>
                  )}
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
