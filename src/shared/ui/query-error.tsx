"use client";

import { Button } from "./button";

export function QueryError({ onRetry, isRetrying = false }: {
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div role="alert" className="flex min-h-60 flex-col items-center justify-center gap-4 px-4">
      <p>정보를 불러오지 못했습니다.</p>
      <Button onClick={onRetry} disabled={isRetrying}>
        {isRetrying ? "불러오는 중..." : "다시 시도"}
      </Button>
    </div>
  );
}
