"use client";

import { Button } from "@/shared/ui/button";

export default function CommunityError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">커뮤니티를 불러오지 못했습니다.</h1>
      <Button className="mt-6" onClick={reset}>다시 시도</Button>
    </main>
  );
}
