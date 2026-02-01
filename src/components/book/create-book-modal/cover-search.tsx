"use client";

import { Book } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookSearchQuery } from "@/hooks/book/react-query/useBookSearchQuery";
import type { KakaoBookDocument } from "@/service/book/getBookSearch";

type CoverSearchProps = {
  onSelect: (data: {
    title: string;
    author: string;
    publisher: string;
    thumbnail: string;
  }) => void;
};

export function CoverSearch({ onSelect }: CoverSearchProps) {
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
    <div className="mt-4 space-y-3">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          <Book className="h-4 w-4" />
          Search Book
          <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
            (required)
          </span>
        </label>
        <Input
          placeholder="검색할 책 제목을 입력하세요"
          className="h-9 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          onBlur={handleTitleBlur}
        />
        <p className="text-xs text-muted-foreground">
          검색어는 자유롭게 입력하고, 선택한 책 정보로 자동 채워져요.
        </p>
        {searchStatus !== "idle" ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              {results.length}개 결과 · {page}/{totalPages} 페이지
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!hasPrevPage}
              >
                이전
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNextPage}
              >
                다음
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {searchStatus === "success" ? (
        <div className="grid grid-cols-3 justify-items-center gap-3">
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
                  });
                }}
                className={`group relative flex aspect-3/4 w-full max-w-[110px] items-center justify-center overflow-hidden rounded-lg border transition ${
                  isSelected
                    ? "border-emerald-400 ring-2 ring-emerald-300/60"
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
                  <span className="absolute right-2 top-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    선택됨
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {searchStatus === "loading" ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 justify-items-center gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex aspect-3/4 w-full max-w-[110px] items-center justify-center rounded-lg bg-muted/40"
              >
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {searchStatus === "empty" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>표지를 찾을 수 없습니다.</span>
          <Button size="sm" variant="secondary">
            AI 표지 생성
          </Button>
        </div>
      ) : null}

      {searchStatus === "error" ? (
        <p className="mt-3 text-xs text-rose-500">
          검색에 실패했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : null}
    </div>
  );
}
