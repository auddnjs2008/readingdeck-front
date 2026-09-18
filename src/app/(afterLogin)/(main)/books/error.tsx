"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";

export default function BooksError({ reset }: { reset: () => void }) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();
  return (
    <div role="alert" className="flex min-h-80 flex-col items-center justify-center gap-5 px-5 text-center text-foreground">
      <p className="font-serif text-xl leading-relaxed">책 정보를 불러오지 못했습니다.</p>
      <Button variant="outline" className="rounded-[6px]! shadow-none!" onClick={() => { resetQueries(); reset(); }}>다시 시도</Button>
    </div>
  );
}
