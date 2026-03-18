"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function HomeSummaryError({
  title = "홈 데이터를 불러오지 못했어요",
  description = "잠시 후 다시 시도해 주세요.",
  onRetry,
}: Props) {
  return (
    <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry}>
          다시 시도
        </Button>
      ) : null}
    </div>
  );
}
