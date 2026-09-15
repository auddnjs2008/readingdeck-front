"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export type CardFilterSort = "latest" | "oldest";

export const CARD_FILTER_TYPE_IDS = [
  "insight",
  "change",
  "action",
  "question",
] as const;

const typeFilters = [
  {
    id: "insight",
    label: "인사이트",
  },
  {
    id: "change",
    label: "변화",
  },
  {
    id: "action",
    label: "행동",
  },
  {
    id: "question",
    label: "질문",
  },
];

const SORT_OPTIONS: { value: CardFilterSort; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

export type CardFilterProps = {
  selectedTypeIds: string[];
  onTypeIdsChange: (ids: string[]) => void;
  sort: CardFilterSort;
  onSortChange: (value: CardFilterSort) => void;
  hasQuote: boolean | undefined;
  onHasQuoteChange: (value: boolean) => void;
  pageStart: string;
  pageEnd: string;
  onPageStartChange: (value: string) => void;
  onPageEndChange: (value: string) => void;
};

export function CardFilter({
  selectedTypeIds,
  onTypeIdsChange,
  sort,
  onSortChange,
  hasQuote,
  onHasQuoteChange,
  pageStart,
  pageEnd,
  onPageStartChange,
  onPageEndChange,
}: CardFilterProps) {
  const handleTypeToggle = (id: string) => {
    const next = selectedTypeIds.includes(id)
      ? selectedTypeIds.filter((t) => t !== id)
      : [...selectedTypeIds, id];
    // 최소 하나는 선택 유지 (빈 필터 방지)
    if (next.length > 0) onTypeIdsChange(next);
  };

  return (
    <div className="border-b border-border pb-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold text-muted-foreground">
            카드 유형
          </legend>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {typeFilters.map((filter) => (
              <label
                key={filter.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={selectedTypeIds.includes(filter.id)}
                  onCheckedChange={() => handleTypeToggle(filter.id)}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">
                정렬
              </span>
              <Select
                value={sort}
                onValueChange={(v) => onSortChange(v as CardFilterSort)}
              >
                <SelectTrigger
                  size="sm"
                  aria-label="카드 정렬"
                  className="h-9 w-[120px] rounded-md bg-transparent"
                >
                  <SelectValue placeholder="최신순" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={hasQuote === true}
                onCheckedChange={(checked) =>
                  onHasQuoteChange(checked === true)
                }
              />
              <span>인용문만 보기</span>
            </label>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-muted-foreground">
              페이지 범위
              <span className="ml-1 font-normal">(선택)</span>
            </legend>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                aria-label="시작 페이지"
                placeholder="시작"
                value={pageStart}
                onChange={(e) => onPageStartChange(e.target.value)}
                className="h-9 w-24 rounded-md bg-transparent text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-sm text-muted-foreground">–</span>
              <Input
                type="number"
                min={1}
                aria-label="끝 페이지"
                placeholder="끝"
                value={pageEnd}
                onChange={(e) => onPageEndChange(e.target.value)}
                className="h-9 w-24 rounded-md bg-transparent text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              비우면 전체 페이지를 표시합니다.
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
