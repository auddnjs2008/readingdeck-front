"use client";

import { Book } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { useBookSearchQuery } from "@/hooks/book/react-query/useBookSearchQuery";
import type { KakaoBookDocument } from "@/service/book/getBookSearch";

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
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          <Book className="h-4 w-4" />책 검색
        </label>
        <Input
          placeholder="검색할 책 제목을 입력하세요"
          className={cn(
            "h-9 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring",
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
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={searchStatus === "idle" || !hasPrevPage}
              className="h-7 text-[11px] px-2.5"
            >
              이전
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={searchStatus === "idle" || !hasNextPage}
              className="h-7 text-[11px] px-2.5"
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[296px] shrink-0 overflow-hidden">
        {searchStatus === "idle" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              2글자 이상 입력해 검색해 보세요
            </p>
          </div>
        ) : null}

        {searchStatus === "success" ? (
          <div className="grid h-full grid-cols-3 justify-items-center gap-3">
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
                className={`group relative flex aspect-3/4 w-full max-w-[110px] items-center justify-center overflow-hidden rounded-lg border transition ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60 hover:border-border"
                }`}
                aria-label={`${result.title} cover`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.thumbnail}
                  alt={`${result.title} cover`}
                  className="h-full w-full object-contain transition-transform group-hover:scale-[1.02]"
                />
                {isSelected ? (
                  <span className="absolute right-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
                    선택됨
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        ) : null}

        {searchStatus === "loading" ? (
          <div className="grid h-full grid-cols-3 justify-items-center gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex aspect-3/4 w-full max-w-[110px] items-center justify-center rounded-lg bg-muted/40"
              >
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : null}

        {searchStatus === "empty" ? (
          <div className="flex h-full flex-col items-stretch justify-start pt-4">
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
