"use client";

import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/ui/utils";
import { useBookSearchQuery } from "@/entities/book/model/queries/useBookSearchQuery";
import type { KakaoBookDocument } from "@/entities/book/api/getBookSearch";

type CoverSearchProps = {
  onSelect: (data: {
    title: string;
    author: string;
    publisher: string;
    thumbnail: string;
    contents: string;
  }) => void;
  /** Rendered when search returns no results (e.g. "직접 입력하기" button) */
  emptyFallback?: React.ReactNode;
  /** Optional class for the root container */
  className?: string;
  /** Optional class for the search input to make it more prominent */
  inputClassName?: string;
};

export function CoverSearch({
  onSelect,
  emptyFallback,
  className,
  inputClassName,
}: CoverSearchProps) {
  const searchInputId = useId();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  );
  const debounceRef = useRef<number | null>(null);

  const trimmedKeyword = debouncedKeyword.trim();
  const isSearchEnabled = trimmedKeyword.length >= 2;
  const pageSize = 6;

  const bookSearchQuery = useBookSearchQuery(
    {
      query: {
        query: trimmedKeyword,
        size: pageSize,
        page,
      },
    },
    { enabled: isSearchEnabled }
  );

  const results = useMemo(() => {
    const docs = bookSearchQuery.data?.documents ?? [];
    return docs.filter(
      (doc: KakaoBookDocument) => doc?.title && doc?.thumbnail
    );
  }, [bookSearchQuery.data]);

  const searchStatus: "idle" | "loading" | "success" | "empty" | "error" =
    !isSearchEnabled
      ? "idle"
      : bookSearchQuery.isLoading
      ? "loading"
      : bookSearchQuery.isError
      ? "error"
      : results.length > 0
      ? "success"
      : "empty";

  const totalPages = bookSearchQuery.data?.meta?.pageable_count
    ? Math.max(
        1,
        Math.ceil(bookSearchQuery.data.meta.pageable_count / pageSize)
      )
    : 1;
  const hasPrevPage = page > 1;
  const hasNextPage = bookSearchQuery.data?.meta
    ? !bookSearchQuery.data.meta.is_end
    : false;

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(1);
    }, 500);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchKeyword]);

  const handleTitleBlur = () => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-3">
        <label
          htmlFor={searchInputId}
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          책 제목
        </label>
        <Input
          id={searchInputId}
          placeholder="검색할 책 제목을 입력하세요"
          className={cn(
            "rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-0",
            inputClassName
          )}
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          onBlur={handleTitleBlur}
        />

        <div className="flex h-8 shrink-0 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {searchStatus === "idle" ? (
            <span className="invisible">0개 결과 · 1/1 페이지</span>
          ) : (
            <p>
              {results.length}개 결과 · {page}/{totalPages} 페이지
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={searchStatus === "idle" || !hasPrevPage}
              className="h-7 px-2.5 text-[11px]"
            >
              이전
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={searchStatus === "idle" || !hasNextPage}
              className="h-7 px-2.5 text-[11px]"
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[336px] shrink-0 overflow-hidden border-y border-border">
        {searchStatus === "idle" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">
              2글자 이상 입력해 검색해 보세요
            </p>
          </div>
        ) : null}

        {searchStatus === "success" ? (
          <div className="custom-scrollbar h-full overflow-y-auto">
            {results.map((result, index) => {
              const isSelected = result.thumbnail === selectedThumbnail;
              return (
                <button
                  key={`${result.isbn}-${result.thumbnail}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedThumbnail(result.thumbnail ?? null);
                    onSelect({
                      title: result.title ?? "",
                      author: result.authors?.[0] ?? "",
                      publisher: result.publisher ?? "",
                      thumbnail: result.thumbnail ?? "",
                      contents: result.contents ?? "",
                    });
                  }}
                  className={`relative flex w-full items-center gap-4 border-b border-border px-3 py-3 text-left transition-colors last:border-b-0 ${
                    isSelected
                      ? "bg-muted/60 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary"
                      : "hover:bg-muted/30"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/20 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.thumbnail}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 font-serif text-base text-foreground">
                      {result.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {[result.authors?.[0], result.publisher]
                        .filter(Boolean)
                        .join(" · ") || "서지 정보 없음"}
                    </span>
                  </span>
                  {isSelected ? (
                    <span className="shrink-0 text-xs font-medium text-primary">
                      선택됨
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {searchStatus === "loading" ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex h-24 items-center gap-4 px-3"
              >
                <div className="h-20 w-14 animate-pulse bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse bg-muted" />
                  <div className="h-3 w-1/3 animate-pulse bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {searchStatus === "empty" ? (
          <div className="flex h-full flex-col items-stretch justify-start py-4">
            {emptyFallback ?? (
              <span className="text-xs text-muted-foreground">
                표지를 찾을 수 없습니다.
              </span>
            )}
          </div>
        ) : null}

        {searchStatus === "error" ? (
          <div className="flex h-full flex-col justify-center gap-2">
            <p className="text-xs text-rose-500">
              검색에 실패했습니다. 잠시 후 다시 시도해 주세요.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => bookSearchQuery.refetch()}
            >
              다시 시도
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
