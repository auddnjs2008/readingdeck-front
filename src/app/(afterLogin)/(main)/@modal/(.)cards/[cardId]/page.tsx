import { Suspense } from "react";

import CardDetailModalShell from "@/entities/card/ui/card-detail-modal-shell";
import CardDetailScene from "@/entities/card/ui/card-detail-scene";

type CardDetailModalPageProps = {
  params: Promise<{ cardId: string }>;
};

export default function CardDetailModalPage({
  params,
}: CardDetailModalPageProps) {
  return (
    <CardDetailModalShell>
      <Suspense fallback={<CardDetailModalSkeleton />}>
        {params.then(({ cardId }) => (
          <CardDetailScene cardId={Number(cardId)} asModal />
        ))}
      </Suspense>
    </CardDetailModalShell>
  );
}

function CardDetailModalSkeleton() {
  return (
    <div className="flex max-h-[90vh] min-h-[360px] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border/70 bg-card px-6 py-4">
        <div className="h-6 w-32 rounded-full bg-muted" />
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>
      <div className="min-h-0 flex-1 px-6 py-6">
        <div className="h-6 w-20 rounded-full bg-muted" />
        <div className="mt-6 h-20 w-full rounded-2xl bg-muted" />
        <div className="mt-6 h-32 w-full rounded-xl bg-muted" />
      </div>
      <div className="shrink-0 border-t border-border/70 bg-card px-6 py-4">
        <div className="h-11 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}
