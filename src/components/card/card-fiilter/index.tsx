"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    label: "Insight",
    pillClass:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10",
    checkboxClass:
      "border-emerald-600/40 text-emerald-100 dark:border-emerald-500/40 dark:text-emerald-200 data-[state=checked]:bg-emerald-600! data-[state=checked]:border-emerald-600! data-[state=checked]:text-white! dark:data-[state=checked]:bg-emerald-500! dark:data-[state=checked]:border-emerald-500! dark:data-[state=checked]:text-emerald-950!",
  },
  {
    id: "change",
    label: "Change",
    pillClass:
      "border-orange-600/30 bg-orange-600/10 text-orange-700 dark:text-orange-400 dark:border-orange-500/20 dark:bg-orange-500/10",
    checkboxClass:
      "border-orange-600/40 text-orange-100 dark:border-orange-500/40 dark:text-orange-200 data-[state=checked]:bg-orange-600! data-[state=checked]:border-orange-600! data-[state=checked]:text-white! dark:data-[state=checked]:bg-orange-500! dark:data-[state=checked]:border-orange-500! dark:data-[state=checked]:text-orange-950!",
  },
  {
    id: "action",
    label: "Action",
    pillClass:
      "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:text-sky-400 dark:border-sky-500/20 dark:bg-sky-500/10",
    checkboxClass:
      "border-sky-600/40 text-sky-100 dark:border-sky-500/40 dark:text-sky-200 data-[state=checked]:bg-sky-600! data-[state=checked]:border-sky-600! data-[state=checked]:text-white! dark:data-[state=checked]:bg-sky-500! dark:data-[state=checked]:border-sky-500! dark:data-[state=checked]:text-sky-950!",
  },
  {
    id: "question",
    label: "Question",
    pillClass:
      "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:text-rose-400 dark:border-rose-500/20 dark:bg-rose-500/10",
    checkboxClass:
      "border-rose-600/40 text-rose-100 dark:border-rose-500/40 dark:text-rose-200 data-[state=checked]:bg-rose-600! data-[state=checked]:border-rose-600! data-[state=checked]:text-white! dark:data-[state=checked]:bg-rose-500! dark:data-[state=checked]:border-rose-500! dark:data-[state=checked]:text-rose-950!",
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
    <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            필터
          </p>
          <div className="flex flex-wrap gap-3">
            {typeFilters.map((filter) => (
              <label
                key={filter.id}
                className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold ${filter.pillClass}`}
              >
                <Checkbox
                  checked={selectedTypeIds.includes(filter.id)}
                  onCheckedChange={() => handleTypeToggle(filter.id)}
                  className={filter.checkboxClass}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="hidden h-full w-px bg-border/60 lg:block" />

        <div className="flex flex-col gap-5 lg:items-start">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                정렬
              </span>
              <Select
                value={sort}
                onValueChange={(v) => onSortChange(v as CardFilterSort)}
              >
                <SelectTrigger size="sm" className="h-9 w-[140px] rounded-full border-border/70 bg-muted/30 focus:ring-primary">
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
            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <Checkbox
                checked={hasQuote === true}
                onCheckedChange={(checked) =>
                  onHasQuoteChange(checked === true)
                }
              />
              <span>인용만 보기</span>
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              페이지 범위
              <span className="ml-1 text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                (선택)
              </span>
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                placeholder="시작"
                value={pageStart}
                onChange={(e) => onPageStartChange(e.target.value)}
                className="h-9 w-20 rounded-full border-border/70 bg-muted/30 text-sm focus-visible:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-sm text-muted-foreground">–</span>
              <Input
                type="number"
                min={1}
                placeholder="끝"
                value={pageEnd}
                onChange={(e) => onPageEndChange(e.target.value)}
                className="h-9 w-20 rounded-full border-border/70 bg-muted/30 text-sm focus-visible:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              비우면 제한 없음
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
