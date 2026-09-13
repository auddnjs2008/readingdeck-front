"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";

export default function BooksError({ reset }: { reset: () => void }) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();
  return (
    <div role="alert" className="flex min-h-80 flex-col items-center justify-center gap-4 px-4">
      <p>책 정보를 불러오지 못했습니다.</p>
      <Button onClick={() => { resetQueries(); reset(); }}>다시 시도</Button>
    </div>
  );
}
