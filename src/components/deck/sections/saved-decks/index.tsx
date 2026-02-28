"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { FolderOpen, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDecksQuery } from "@/hooks/deck/react-query/useDecksQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { DeckPreviewMini } from "@/components/deck/deck-preview-mini";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

type FilterType = "all" | "draft" | "published";
type SortType = "latest" | "oldest";

const FILTER_OPTIONS: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "전체" },
  { key: "draft", label: "작성 중" },
  { key: "published", label: "발행됨" },
];

export function SavedDecksSection() {
  const router = useRouter();
  const [sort, setSort] = useState<SortType>("latest");
  const [savedFilter, setSavedFilter] = useState<FilterType>("all");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  const savedDecksQuery = useDecksQuery({
    query: {
      take: 24,
      sort,
      status: savedFilter === "all" ? undefined : savedFilter,
      keyword: debouncedKeyword.trim() || undefined,
    },
  });

  const savedDeckItems = savedDecksQuery.data?.items;
  const savedDecks = savedDeckItems ?? [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-[18px] w-[18px] text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            저장된 덱
          </h2>
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          총 {savedDecksQuery.data?.meta.total ?? 0}개
        </span>
      </div>

      <div className="mb-4 relative w-full">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-12 rounded-lg border-border bg-card pl-12"
          placeholder="덱 검색..."
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            필터:
          </span>
          {FILTER_OPTIONS.map((option) => {
            const active = savedFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSavedFilter(option.key)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary font-bold text-primary-foreground shadow-sm"
                    : "border-border bg-secondary font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                #{option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 border-l border-border pl-4">
          <button
            type="button"
            onClick={() => setSort("latest")}
            className={`rounded px-3 py-1.5 text-xs font-medium ${
              sort === "latest"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            최신순
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
            오래된순
          </button>
        </div>
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
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_4px_12px_rgba(63,54,49,0.05)] transition-all hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(63,54,49,0.08)]"
                onClick={() => router.push(`/decks/${deck.id}`)}
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
                      {deck.status === "draft" ? "작성 중" : "발행됨"}
                    </span>
                  </div>
                  <p className="mb-5 text-xs text-muted-foreground">
                    마지막 수정: {formatUpdatedAt(deck.updatedAt)}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {deck.nodeCount} 노드 · {deck.connectionCount} 연결
                    </span>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:text-primary/80"
                      onClick={() => router.push(`/decks/${deck.id}`)}
                    >
                      열기
                    </button>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
