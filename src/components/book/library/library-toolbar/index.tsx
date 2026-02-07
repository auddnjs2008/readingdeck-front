"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import type { ReqGetBooks } from "@/service/book/getBooks";

type SortValue = NonNullable<ReqGetBooks["query"]>["sort"];

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "createdAt", label: "최근 추가순" },
  { value: "recentCard", label: "최근 카드 활동순" },
  { value: "mostCards", label: "카드 많은순" },
];

const DEFAULT_SORT: SortValue = "createdAt";

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
      router.push(`?${p.toString()}`);
    },
    [router, searchParams]
  );

  const rawSort = searchParams.get("sort");
  const sort: SortValue =
    rawSort === "recentCard" || rawSort === "mostCards"
      ? rawSort
      : DEFAULT_SORT;
  const keyword = searchParams.get("keyword") ?? "";

  return { sort, keyword, setParams };
}

export default function LibraryToolbar() {
  const { sort, keyword, setParams } = useLibrarySearchParams();
  const [keywordInput, setKeywordInput] = useState(keyword);

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const handleSortChange = (value: string) => {
    setParams({ sort: value, page: "1" });
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ keyword: keywordInput.trim(), page: "1" });
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button size="sm" className="h-9 rounded-full px-4 text-sm font-bold">
          전체
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-full px-4 text-sm"
        >
          읽는 중
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-full px-4 text-sm"
        >
          완료
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-full px-4 text-sm"
        >
          보류
        </Button>
      </div>
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
        <form
          onSubmit={handleKeywordSubmit}
          className="relative w-full sm:w-64"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="키워드로 검색..."
            className="h-10 rounded-xl border-border/60 bg-card pl-9 text-sm"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </form>
        <div className="flex w-full flex-1 gap-3 sm:w-auto">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger
              size="sm"
              className="h-10 flex-1 justify-between rounded-xl px-4 sm:flex-none"
            >
              <SelectValue>
                {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "정렬"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value!}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-xl p-0"
            title="필터"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
