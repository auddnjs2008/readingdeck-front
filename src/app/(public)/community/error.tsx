"use client";

import { Button } from "@/shared/ui/button";

export default function CommunityError({ reset }: { reset: () => void }) {
  return (
    <main role="alert" className="mx-auto max-w-xl px-5 py-16 text-center text-foreground">
      <h1 className="font-serif text-xl leading-relaxed">커뮤니티를 불러오지 못했습니다.</h1>
      <Button variant="outline" className="mt-6 rounded-[6px]! shadow-none!" onClick={reset}>다시 시도</Button>
    </main>
  );
}
