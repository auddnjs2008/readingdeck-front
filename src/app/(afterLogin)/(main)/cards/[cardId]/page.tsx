import type { Metadata } from "next";
import { Suspense } from "react";

import CardDetailScene from "@/entities/card/ui/card-detail-scene";

export const metadata: Metadata = {
  title: "카드 상세",
};

type CardDetailPageProps = {
  params: Promise<{ cardId: string }>;
};

export default function CardDetailPage({ params }: CardDetailPageProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[900px] px-4 py-8 md:px-8 md:py-10">
      <div className="w-full">
        <Suspense fallback={<CardDetailSceneSkeleton />}>
          {params.then(({ cardId }) => (
            <CardDetailScene cardId={Number(cardId)} />
          ))}
        </Suspense>
      </div>
    </main>
  );
}

function CardDetailSceneSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-5 w-24 rounded-full bg-muted" />
      <div className="rounded-[28px] border border-border/70 bg-card px-7 py-8 shadow-[0_24px_60px_rgba(63,54,49,0.14)]">
        <div className="h-6 w-24 rounded-full bg-muted" />
        <div className="mt-8 h-16 w-full rounded-2xl bg-muted" />
        <div className="mt-6 h-32 w-full rounded-[24px] bg-muted" />
        <div className="mt-7 h-14 w-full rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
