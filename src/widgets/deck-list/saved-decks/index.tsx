"use client";

import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { useDecksQuery } from "@/entities/deck/model/queries/useDecksQuery";
import { useMyLibraryStatsQuery } from "@/entities/me/model/queries/useMyLibraryStatsQuery";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { DeckPreviewMini } from "@/entities/deck/ui/deck-preview-mini";
import { getDeckHref } from "@/entities/deck/api/getDeckHref";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatUpdatedAt = (updatedAt: string) => dayjs(updatedAt).fromNow();

type FilterType = "all" | "draft" | "published";
type ModeFilterType = "all" | "list" | "graph";
type SharedFilterType = "all" | "shared";
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
const SHARED_FILTER_OPTIONS: Array<{ key: SharedFilterType; label: string }> = [
  { key: "all", label: "전체" },
  { key: "shared", label: "공유됨" },
];

export function SavedDecksSection() {
  const libraryStatsQuery = useMyLibraryStatsQuery();
  const [sort, setSort] = useState<SortType>("latest");
  const [savedFilter, setSavedFilter] = useState<FilterType>("published");
  const [modeFilter, setModeFilter] = useState<ModeFilterType>("all");
  const [sharedFilter, setSharedFilter] = useState<SharedFilterType>("all");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const hasAnyFilter =
    savedFilter !== "published" ||
    modeFilter !== "all" ||
    sharedFilter !== "all" ||
    keyword.trim().length > 0;

  const savedDecksQuery = useDecksQuery({
    query: {
      take: 24,
      sort,
      status: savedFilter === "all" ? undefined : savedFilter,
      mode: modeFilter === "all" ? undefined : modeFilter,
      shared: sharedFilter === "shared" ? true : undefined,
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
      <div className="mb-6 flex items-center justify-between border-b border-[#d8d4cc] pb-3 dark:border-[#4b4842]">
        <h2 className="text-sm font-medium text-muted-foreground">완성된 덱</h2>
        <span className="text-xs text-muted-foreground">
          총 {savedDecksQuery.isPending ? "—" : totalCount}개
        </span>
      </div>

      {showFilterToolbar ? (
        <>
          <div className="relative mb-4 w-full">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-10 rounded-none border-0 border-b border-[#d8d4cc] bg-transparent pl-8 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-[#4b4842]"
              placeholder="덱 이름으로 검색"
            />
          </div>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-y border-[#d8d4cc] py-3 dark:border-[#4b4842]">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-muted-foreground">
                  상태:
                </span>
                {STATUS_FILTER_OPTIONS.map((option) => {
                  const active = savedFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSavedFilter(option.key)}
                      className={`border-b px-2 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-primary font-semibold text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-muted-foreground">
                  모드:
                </span>
                {MODE_FILTER_OPTIONS.map((option) => {
                  const active = modeFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setModeFilter(option.key)}
                      className={`border-b px-2 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-primary font-semibold text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-muted-foreground">
                  공유:
                </span>
                {SHARED_FILTER_OPTIONS.map((option) => {
                  const active = sharedFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSharedFilter(option.key)}
                      className={`border-b px-2 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-primary font-semibold text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-[#d8d4cc] pl-4 dark:border-[#4b4842]">
              {hasAnyFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    setSavedFilter("published");
                    setModeFilter("all");
                    setSharedFilter("all");
                    setKeyword("");
                  }}
                  className="border-b border-primary px-1 py-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  초기화
                </button>
              ) : null}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSort("latest")}
                  className={`border-b px-2 py-1.5 text-xs transition-colors ${
                    sort === "latest"
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  최신순
                </button>
                <button
                  type="button"
                  onClick={() => setSort("oldest")}
                  className={`border-b px-2 py-1.5 text-xs transition-colors ${
                    sort === "oldest"
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
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
        <div className="border-y border-destructive/40 py-4 text-sm text-destructive">
          덱 목록을 불러오지 못했습니다.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedDecksQuery.isPending ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={`saved-skeleton-${index}`} className="space-y-3 animate-pulse">
              <div className="aspect-[16/10] rounded-[4px] border border-[#d8d4cc] bg-[#efede8] dark:border-[#4b4842] dark:bg-[#302e2a]" />
              <div className="h-5 w-3/5 bg-muted/60" />
              <div className="h-3 w-4/5 bg-muted/40" />
            </div>
          ))
        ) : isGloballyEmpty ? (
          <div className="col-span-full border-y border-[#d8d4cc] py-6 dark:border-[#4b4842]">
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
          <p className="col-span-full border-y border-[#d8d4cc] py-8 text-center text-sm text-muted-foreground dark:border-[#4b4842]">
            조건에 맞는 덱이 없어요.
          </p>
        ) : (
          savedDecks.map((deck) => (
            <Link
              key={deck.id}
              href={getDeckHref(deck)}
              className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-[#d8d4cc] bg-[#efede8] transition-colors group-hover:border-primary/60 dark:border-[#4b4842] dark:bg-[#302e2a]">
                <DeckPreviewMini preview={deck.preview} />
              </div>
              <div className="pt-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 flex-1 line-clamp-1 font-serif text-lg font-semibold">
                    {deck.name}
                  </h3>
                  <span className="shrink-0 text-[10px] font-semibold text-primary">
                    {deck.status === "draft" ? "작성 중" : "발행됨"}
                    {deck.isShared ? " · 공유됨" : ""}
                  </span>
                </div>
                {deck.description?.trim() ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {deck.description}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {deck.nodeCount}개 노드 · {deck.connectionCount}개 연결 · {formatUpdatedAt(deck.updatedAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
