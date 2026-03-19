"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { FolderOpen, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDecksQuery } from "@/hooks/deck/react-query/useDecksQuery";
import { useMyLibraryStatsQuery } from "@/hooks/me/react-query/useMyLibraryStatsQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { DeckPreviewMini } from "@/components/deck/deck-preview-mini";
import { getDeckHref } from "@/service/deck/getDeckHref";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

type FilterType = "all" | "draft" | "published";
type ModeFilterType = "all" | "list" | "graph";
type SortType = "latest" | "oldest";

const STATUS_FILTER_OPTIONS: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "전체" },
  { key: "draft", label: "작성 중" },
  { key: "published", label: "발행됨" },
];
const MODE_FILTER_OPTIONS: Array<{ key: ModeFilterType; label: string }> = [
  { key: "all", label: "전체" },
  { key: "list", label: "List" },
  { key: "graph", label: "Graph" },
];

export function SavedDecksSection() {
  const router = useRouter();
  const libraryStatsQuery = useMyLibraryStatsQuery();
  const [sort, setSort] = useState<SortType>("latest");
  const [savedFilter, setSavedFilter] = useState<FilterType>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilterType>("all");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const hasAnyFilter =
    savedFilter !== "all" || modeFilter !== "all" || keyword.trim().length > 0;

  const savedDecksQuery = useDecksQuery({
    query: {
      take: 24,
      sort,
      status: savedFilter === "all" ? undefined : savedFilter,
      mode: modeFilter === "all" ? undefined : modeFilter,
      keyword: debouncedKeyword.trim() || undefined,
    },
  });

  const savedDeckItems = savedDecksQuery.data?.items;
  const savedDecks = savedDeckItems ?? [];
  const totalCount = savedDecksQuery.data?.meta.total ?? 0;

  const isGloballyEmpty =
    !savedDecksQuery.isPending &&
    !savedDecksQuery.isError &&
    totalCount === 0 &&
    !hasAnyFilter;

  const showFilterToolbar =
    !savedDecksQuery.isPending && !isGloballyEmpty;

  const noBooksInLibrary =
    libraryStatsQuery.isSuccess && libraryStatsQuery.data.bookCount === 0;

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
          총 {savedDecksQuery.isPending ? "—" : totalCount}개
        </span>
      </div>

      {showFilterToolbar ? (
        <>
          <div className="mb-4 relative w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-12 rounded-full border-border/70 bg-muted/30 pl-12 focus-visible:ring-primary"
              placeholder="덱 이름으로 검색해보세요"
            />
          </div>

          <div className="mb-6 flex flex-wrap items-start gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-muted-foreground">
                  상태:
                </span>
                {STATUS_FILTER_OPTIONS.map((option) => {
                  const active = savedFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSavedFilter(option.key)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-primary/30 bg-primary/10 font-bold text-primary shadow-sm"
                          : "border-border/70 bg-muted/30 font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      #{option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-muted-foreground">
                  모드:
                </span>
                {MODE_FILTER_OPTIONS.map((option) => {
                  const active = modeFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setModeFilter(option.key)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-primary/30 bg-primary/10 font-bold text-primary shadow-sm"
                          : "border-border/70 bg-muted/30 font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1 border-l border-border/70 pl-4">
              {hasAnyFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    setSavedFilter("all");
                    setModeFilter("all");
                    setKeyword("");
                  }}
                  className="mr-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  초기화
                </button>
              ) : null}
              <div className="flex rounded-full bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => setSort("latest")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === "latest"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  최신순
                </button>
                <button
                  type="button"
                  onClick={() => setSort("oldest")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === "oldest"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  오래된순
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {savedDecksQuery.isError ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          덱 목록을 불러오지 못했습니다.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedDecksQuery.isPending ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`saved-skeleton-${index}`}
              className="h-[290px] animate-pulse rounded-xl border border-border bg-card/60"
            />
          ))
        ) : isGloballyEmpty ? (
          <div className="col-span-full border-l-2 border-primary/25 py-1 pl-4 md:pl-5">
            <p className="text-sm font-medium text-foreground">
              저장된 덱이 아직 없어요
            </p>
            {noBooksInLibrary ? (
              <>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
                  덱을 채우려면 서재에 책이 필요해요. 책을 추가한 뒤 카드를 남기고
                  위에서 덱을 만들 수 있어요.
                </p>
                <Link
                  href="/books"
                  className="mt-4 inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  책 추가하러 가기 →
                </Link>
              </>
            ) : (
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
                위 &lsquo;작업 중인 덱&rsquo;에서 새 덱을 시작하면 여기에 쌓이고,
                발행한 덱도 이곳에서 모아볼 수 있어요.
              </p>
            )}
          </div>
        ) : savedDecks.length === 0 && hasAnyFilter ? (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            조건에 맞는 덱이 없어요.
          </p>
        ) : (
          savedDecks.map((deck) => (
              <article
                key={deck.id}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_4px_12px_rgba(63,54,49,0.05)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(63,54,49,0.08)]"
                onClick={() => router.push(getDeckHref(deck))}
              >
                <div className="relative h-40 w-full overflow-hidden border-b border-border bg-muted/30">
                  <DeckPreviewMini preview={deck.preview} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 line-clamp-1 text-lg font-bold font-serif">
                      {deck.name}
                    </h3>
                    <span
                      className={`shrink-0 whitespace-nowrap rounded border-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-none ${
                        deck.status === "draft"
                          ? "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                          : "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                      }`}
                    >
                      {deck.status === "draft" ? "작성 중" : "발행됨"}
                    </span>
                  </div>
                  {deck.description?.trim() ? (
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {deck.description}
                    </p>
                  ) : null}
                  <p className="mb-5 text-xs text-muted-foreground">
                    마지막 수정: {formatUpdatedAt(deck.updatedAt)}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      <strong className="font-semibold text-foreground/80">{deck.nodeCount}</strong> 노드
                      <span className="mx-1.5 text-border/80">|</span>
                      <strong className="font-semibold text-foreground/80">{deck.connectionCount}</strong> 연결
                    </span>
                    <button
                      type="button"
                      className="text-xs font-bold text-primary transition-colors hover:text-primary/80"
                      onClick={() => router.push(getDeckHref(deck))}
                    >
                      열기
                    </button>
                  </div>
                </div>
              </article>
            ))
        )}
      </div>
    </section>
  );
}
