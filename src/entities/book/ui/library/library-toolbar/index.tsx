"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search } from "lucide-react";
import type { ReqGetBooks } from "@/entities/book/api/getBooks";

type SortValue = Exclude<NonNullable<ReqGetBooks["query"]>["sort"], undefined>;
type StatusValue = Exclude<
  NonNullable<ReqGetBooks["query"]>["status"],
  undefined
>;

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "createdAt", label: "최근 추가순" },
  { value: "recentCard", label: "최근 카드 활동순" },
  { value: "mostCards", label: "카드 많은순" },
];

const DEFAULT_SORT: SortValue = "createdAt";
const STATUS_OPTIONS: {
  value: "all" | StatusValue;
  label: string;
}[] = [
  { value: "all", label: "전체" },
  { value: "reading", label: "읽는 중" },
  { value: "finished", label: "완독" },
  { value: "paused", label: "중단" },
];

function useLibrarySearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) p.set(k, v);
        else p.delete(k);
      });
      router.push(`?${p.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const rawSort = searchParams.get("sort");
  const sort: SortValue =
    rawSort === "recentCard" || rawSort === "mostCards"
      ? rawSort
      : DEFAULT_SORT;
  const keyword = searchParams.get("keyword") ?? "";
  const rawStatus = searchParams.get("status");
  const status: StatusValue | "all" =
    rawStatus === "reading" || rawStatus === "finished" || rawStatus === "paused"
      ? rawStatus
      : "all";

  return { sort, keyword, status, setParams };
}

export default function LibraryToolbar() {
  const { sort, keyword, status, setParams } = useLibrarySearchParams();
  const [keywordInput, setKeywordInput] = useState(keyword);

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const handleSortChange = (value: string) => {
    setParams({ sort: value, page: "1" });
  };

  const handleStatusChange = (value: "all" | StatusValue) => {
    setParams({ status: value === "all" ? "" : value, page: "1" });
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ keyword: keywordInput.trim(), page: "1" });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleKeywordSubmit} role="search" className="flex items-center gap-3 border-b border-border/70">
        <button type="submit" aria-label="검색" title="검색" className="flex size-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-primary">
          <Search className="size-4" />
        </button>
        <input
          type="search"
          aria-label="책 제목이나 저자 검색"
          placeholder="책 제목이나 저자로 검색"
          className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
        />
      </form>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div role="group" aria-label="독서 상태" className="flex items-center gap-5">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`border-b-2 py-2 text-sm whitespace-nowrap transition-colors focus-visible:outline-primary ${status === option.value ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger aria-label="책 정렬" size="sm" className="min-w-40 rounded-[6px]! border-0! bg-transparent! px-0! shadow-none!">
            <SelectValue>{SORT_OPTIONS.find((option) => option.value === sort)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
