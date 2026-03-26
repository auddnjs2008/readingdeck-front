"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { ArrowLeft, BookOpenText, Loader2 } from "lucide-react";

import { CommunityComments } from "@/components/community/community-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCommunityPostDetailQuery } from "@/hooks/community/react-query/useCommunityPostDetailQuery";
import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";
import type {
  CommunityPostSnapshotConnection,
  CommunityPostSnapshotNode,
} from "@/service/community/types";

type ReadView = "graph" | "list";

type GraphPreviewNode = {
  id: number;
  x: number;
  y: number;
  type: "book" | "card";
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
  insight: "인사이트",
  change: "변화",
  action: "액션",
  question: "질문",
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

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const formatPageRange = (pageStart: number | null, pageEnd: number | null) => {
  if (pageStart && pageEnd) return `p.${pageStart}-${pageEnd}`;
  if (pageStart) return `p.${pageStart}`;
  if (pageEnd) return `p.${pageEnd}`;
  return null;
};

const buildGraphPreview = (
  nodes: CommunityPostSnapshotNode[],
  connections: CommunityPostSnapshotConnection[]
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

export default function CommunityDetailPageClient() {
  const params = useParams<{ postId: string }>();
  const parsedPostId = Number(params?.postId);
  const isValidPostId = Number.isFinite(parsedPostId) && parsedPostId > 0;
  const { data: myProfile } = useMyProfileQuery();

  const { data, isPending, isError } = useCommunityPostDetailQuery(
    {
      path: { postId: isValidPostId ? parsedPostId : 0 },
    },
    {
      enabled: isValidPostId,
    }
  );

  const [manualView, setManualView] = useState<ReadView | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const cardNodes = useMemo(
    () =>
      (data?.snapshot.nodes ?? [])
        .filter((node) => node.type === "card" && node.card)
        .sort((a, b) => a.order - b.order),
    [data?.snapshot.nodes]
  );

  const graphPreview = useMemo(
    () =>
      buildGraphPreview(
        data?.snapshot.nodes ?? [],
        data?.snapshot.connections ?? []
      ),
    [data?.snapshot.connections, data?.snapshot.nodes]
  );

  const defaultView: ReadView = data?.deckMode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const resolvedSelectedNodeId =
    selectedNodeId ?? cardNodes[0]?.id ?? data?.snapshot.nodes[0]?.id ?? null;

  const selectedNode = useMemo(() => {
    if (!resolvedSelectedNodeId) return null;
    return (
      (data?.snapshot.nodes ?? []).find(
        (node) => node.id === resolvedSelectedNodeId
      ) ?? null
    );
  }, [data?.snapshot.nodes, resolvedSelectedNodeId]);

  const isOwner = Boolean(data && myProfile && data.author.id === myProfile.id);

  const relatedNodeIds = useMemo(() => {
    if (!resolvedSelectedNodeId) return new Set<number>();

    return new Set(
      (data?.snapshot.connections ?? []).flatMap((connection) => {
        if (connection.fromNodeId === resolvedSelectedNodeId) {
          return [connection.toNodeId];
        }

        if (connection.toNodeId === resolvedSelectedNodeId) {
          return [connection.fromNodeId];
        }

        return [];
      })
    );
  }, [data?.snapshot.connections, resolvedSelectedNodeId]);

  if (!isValidPostId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        잘못된 공유 주소입니다.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        공유된 덱을 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-destructive">
        공유된 덱을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            커뮤니티로
          </Link>

          {isOwner ? (
            <Button
              as={Link}
              href={`/decks/${data.deckId}`}
              variant="outline"
              size="sm"
            >
              원본 덱 보기
            </Button>
          ) : null}
        </div>

        <section className="overflow-hidden rounded-[34px] border border-border/80 bg-card shadow-[0_22px_48px_rgba(63,54,49,0.08)]">
          <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(193,92,61,0.12),transparent_30%),linear-gradient(180deg,rgba(238,229,221,0.82),rgba(215,201,190,0.52))] px-6 py-7 md:px-8 md:py-8">
            <div className="min-w-0 max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-background/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {data.deckMode === "graph" ? "Graph deck" : "List deck"}
                </span>
                <span className="rounded-full border border-border/70 bg-background/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Shared snapshot
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight font-serif text-foreground md:text-5xl">
                {data.deckName}
              </h1>

              {data.caption ? (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/78 md:text-base">
                  {data.caption}
                </p>
              ) : data.deckDescription ? (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/78 md:text-base">
                  {data.deckDescription}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-foreground/72">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage
                      src={data.author.profile ?? undefined}
                      alt={data.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(data.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {data.author.name}
                    </p>
                    <p className="text-foreground/64">
                      {dayjs(data.createdAt).format("YYYY.MM.DD")}
                    </p>
                  </div>
                </div>

                {data.bookTitle ? (
                  <>
                    <span className="hidden text-foreground/30 md:inline">
                      ·
                    </span>
                    <div className="flex items-center gap-2">
                      <BookOpenText className="h-4 w-4 text-primary" />
                      <p>
                        <span className="font-medium text-foreground">
                          {data.bookTitle}
                        </span>
                        {data.bookAuthor ? (
                          <span className="text-foreground/60">{` · ${data.bookAuthor}`}</span>
                        ) : null}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {data.deckMode === "graph" ? (
            <div className="border-b border-border/70 px-6 py-4 md:px-8">
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
          ) : null}

          <div className="px-6 py-8 md:px-8">
            {activeView === "list" ? (
              cardNodes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
                  아직 순서대로 읽을 카드가 없습니다.
                </div>
              ) : (
                <div className="space-y-5">
                  {cardNodes.map((node, index) => {
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
                          <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 whitespace-pre-line text-[17px] font-medium leading-8 text-foreground md:text-[19px]">
                            {node.card.quote}
                          </blockquote>
                        ) : null}

                        <p className="whitespace-pre-line text-[15px] leading-8 text-foreground/90">
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
                    <h2 className="text-lg font-semibold">
                      Shared reading structure
                    </h2>
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
                                : 0.58
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
                                x={
                                  node.x -
                                  (isSelected ? 3.4 : isRelated ? 2.8 : 2.2)
                                }
                                y={
                                  node.y -
                                  (isSelected ? 3.4 : isRelated ? 2.8 : 2.2)
                                }
                                width={isSelected ? 6.8 : isRelated ? 5.6 : 4.4}
                                height={
                                  isSelected ? 6.8 : isRelated ? 5.6 : 4.4
                                }
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
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <aside className="rounded-[24px] border border-border bg-background px-5 py-5">
                  {selectedNode ? (
                    <>
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

                          <p className="mt-4 whitespace-pre-line text-base font-semibold leading-7 text-foreground">
                            {selectedNode.card.thought}
                          </p>

                          {selectedNode.card.quote ? (
                            <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 whitespace-pre-line text-sm italic leading-relaxed text-muted-foreground">
                              &ldquo;{selectedNode.card.quote}&rdquo;
                            </blockquote>
                          ) : null}

                          {selectedNode.book?.title ||
                          formatPageRange(
                            selectedNode.card.pageStart,
                            selectedNode.card.pageEnd
                          ) ? (
                            <p className="mt-4 text-sm text-muted-foreground">
                              {[
                                selectedNode.book?.title
                                  ? `${selectedNode.book.title}${
                                      selectedNode.book.author
                                        ? ` · ${selectedNode.book.author}`
                                        : ""
                                    }`
                                  : null,
                                formatPageRange(
                                  selectedNode.card.pageStart,
                                  selectedNode.card.pageEnd
                                ),
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <>
                          {selectedNode.book?.backgroundImage ? (
                            <div className="mb-5 flex items-center justify-center overflow-hidden p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={selectedNode.book.backgroundImage}
                                alt={selectedNode.book.title ?? "책 표지"}
                                className="h-auto max-h-[320px] w-auto max-w-full object-contain"
                              />
                            </div>
                          ) : null}
                          <h3 className="text-xl font-semibold font-serif text-foreground">
                            {selectedNode.book?.title ?? "책 정보 없음"}
                          </h3>
                          {selectedNode.book?.author ? (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {selectedNode.book.author}
                            </p>
                          ) : null}
                          {selectedNode.book?.publisher ? (
                            <p className="mt-1 text-sm text-muted-foreground/80">
                              {selectedNode.book.publisher}
                            </p>
                          ) : null}
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      노드를 눌러 내용을 읽어보세요.
                    </p>
                  )}
                </aside>
              </div>
            )}
          </div>
        </section>

        <CommunityComments postId={data.id} currentUserId={myProfile?.id} />
      </main>
    </div>
  );
}
