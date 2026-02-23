"use client";

import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowRight, FileEdit, FolderOpen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDecksQuery } from "@/hooks/deck/react-query/useDecksQuery";
import { useDebounce } from "@/hooks/useDebounce";

type FilterType = "all" | "draft" | "published";
type SortType = "latest" | "oldest";

type Preview = {
  nodes: Array<{ x: number; y: number; t: "book" | "card" }>;
  edges: Array<{ sx: number; sy: number; tx: number; ty: number }>;
};

const FILTER_OPTIONS: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
];

dayjs.extend(relativeTime);

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

function DeckPreviewMini({ preview }: { preview: Preview | null }) {
  if (!preview || (preview.nodes.length === 0 && preview.edges.length === 0)) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    );
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#deck-grid)"
        opacity="0.28"
      />
      <defs>
        <pattern
          id="deck-grid"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.45" fill="#475569" />
        </pattern>
      </defs>
      {preview.edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.sx * 100}
          y1={edge.sy * 100}
          x2={edge.tx * 100}
          y2={edge.ty * 100}
          stroke="#3a4d6a"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
      {preview.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x * 100}
          cy={node.y * 100}
          r={node.t === "book" ? 2.2 : 2}
          fill={node.t === "book" ? "#4f85e9" : "#9aa9be"}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

export default function DecksPage() {
  const [sort, setSort] = useState<SortType>("latest");
  const [savedFilter, setSavedFilter] = useState<FilterType>("all");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  const activeDraftsQuery = useDecksQuery({
    query: {
      take: 8,
      status: "draft",
      sort,
    },
  });

  const savedDecksQuery = useDecksQuery({
    query: {
      take: 24,
      sort,
      status: savedFilter === "all" ? undefined : savedFilter,
      keyword: debouncedKeyword.trim() || undefined,
    },
  });

  const activeDrafts = activeDraftsQuery.data?.items ?? [];
  const savedDeckItems = savedDecksQuery.data?.items;
  const savedDecks = savedDeckItems ?? [];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "24px 24px",
          backgroundImage: "radial-gradient(#334155 1.5px, transparent 1.5px)",
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1400px] space-y-10 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">My Decks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your reading flows and knowledge graphs.
            </p>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setSort("latest")}
              className={`rounded px-3 py-1.5 text-xs font-medium ${
                sort === "latest"
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              Recent
            </button>
            <button
              type="button"
              onClick={() => setSort("oldest")}
              className={`rounded px-3 py-1.5 text-xs font-medium ${
                sort === "oldest"
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              Oldest
            </button>
          </div>
        </div>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileEdit className="h-[18px] w-[18px] text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Active Drafts
              </h2>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              View All ({activeDrafts.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/decks/create"
              className="group flex h-[190px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary/60 hover:bg-card"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-lg font-medium">Create New Deck</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Start from scratch
              </span>
            </Link>

            {activeDraftsQuery.isPending
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`draft-skeleton-${index}`}
                    className="h-[190px] animate-pulse rounded-xl border border-border bg-card/60"
                  />
                ))
              : activeDrafts.map((deck) => (
                  <article
                    key={deck.id}
                    className="group flex h-[190px] flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                          In Progress
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-xl font-bold">
                        {deck.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Last edited {formatUpdatedAt(deck.updatedAt)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground">
                        {deck.nodeCount} NODES
                      </span>
                      <Link
                        href={`/decks/create?deckId=${deck.id}`}
                        className="text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Continue
                      </Link>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-[18px] w-[18px] text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Saved Decks
              </h2>
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {savedDecksQuery.data?.meta.total ?? 0} Decks Total
            </span>
          </div>

          <div className="mb-4 relative w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-12 rounded-lg border-border bg-card pl-12"
              placeholder="Search decks..."
            />
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Filters:
            </span>
            {FILTER_OPTIONS.map((option) => {
              const active = savedFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSavedFilter(option.key)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  #{option.label}
                </button>
              );
            })}
          </div>

          {savedDecksQuery.isError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              덱 목록을 불러오지 못했습니다.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedDecksQuery.isPending
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`saved-skeleton-${index}`}
                    className="h-[290px] animate-pulse rounded-xl border border-border bg-card/60"
                  />
                ))
              : savedDecks.map((deck) => (
                  <article
                    key={deck.id}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40"
                  >
                    <div className="relative h-40 w-full overflow-hidden border-b border-border bg-muted/30">
                      <DeckPreviewMini preview={deck.preview} />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-lg font-bold">
                          {deck.name}
                        </h3>
                        <span
                          className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            deck.status === "draft"
                              ? "border-amber-500/30 text-amber-500"
                              : "border-emerald-500/30 text-emerald-500"
                          }`}
                        >
                          {deck.status}
                        </span>
                      </div>
                      <p className="mb-5 text-xs text-muted-foreground">
                        Last edited {formatUpdatedAt(deck.updatedAt)}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {deck.nodeCount} nodes · {deck.connectionCount} edges
                        </span>
                        <Link
                          href={`/decks/create?deckId=${deck.id}`}
                          className="text-xs font-medium text-primary hover:text-primary/80"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}
