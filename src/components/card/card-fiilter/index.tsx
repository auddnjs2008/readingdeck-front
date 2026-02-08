"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    checkboxClass:
      "border-emerald-500/60 text-emerald-200 dark:border-emerald-500/60 dark:text-emerald-200 data-[state=checked]:bg-emerald-500! data-[state=checked]:border-emerald-500! data-[state=checked]:text-white!",
  },
  {
    id: "change",
    label: "Change",
    pillClass:
      "border-amber-500/40 bg-amber-500/10 text-amber-300",
    checkboxClass:
      "border-amber-500/60 text-amber-200 dark:border-amber-500/60 dark:text-amber-200 data-[state=checked]:bg-amber-500! data-[state=checked]:border-amber-500! data-[state=checked]:text-white!",
  },
  {
    id: "action",
    label: "Action",
    pillClass:
      "border-blue-500/40 bg-blue-500/10 text-blue-300",
    checkboxClass:
      "border-blue-500/60 text-blue-200 dark:border-blue-500/60 dark:text-blue-200 data-[state=checked]:bg-blue-500! data-[state=checked]:border-blue-500! data-[state=checked]:text-white!",
  },
  {
    id: "question",
    label: "Question",
    pillClass:
      "border-purple-500/40 bg-purple-500/10 text-purple-300",
    checkboxClass:
      "border-purple-500/60 text-purple-200 dark:border-purple-500/60 dark:text-purple-200 data-[state=checked]:bg-purple-500! data-[state=checked]:border-purple-500! data-[state=checked]:text-white!",
  },
];

const SORT_OPTIONS: { value: CardFilterSort; label: string }[] = [
  { value: "latest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export type CardFilterProps = {
  selectedTypeIds: string[];
  onTypeIdsChange: (ids: string[]) => void;
  sort: CardFilterSort;
  onSortChange: (value: CardFilterSort) => void;
  hasQuote: boolean | undefined;
  onHasQuoteChange: (value: boolean) => void;
};

export function CardFilter({
  selectedTypeIds,
  onTypeIdsChange,
  sort,
  onSortChange,
  hasQuote,
  onHasQuoteChange,
}: CardFilterProps) {
  const handleTypeToggle = (id: string) => {
    const next = selectedTypeIds.includes(id)
      ? selectedTypeIds.filter((t) => t !== id)
      : [...selectedTypeIds, id];
    onTypeIdsChange(next);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Filter By:
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
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Sort:
            </span>
            <Select
              value={sort}
              onValueChange={(v) => onSortChange(v as CardFilterSort)}
            >
              <SelectTrigger size="sm" className="h-9 w-[160px] rounded-full">
                <SelectValue placeholder="Newest First" />
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
            <span>Has Quote?</span>
          </label>
        </div>
      </div>
    </div>
  );
}
