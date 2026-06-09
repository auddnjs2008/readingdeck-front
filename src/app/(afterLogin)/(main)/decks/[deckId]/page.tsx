import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DeckReadDetail,
  DeckReadDetailSkeleton,
} from "@/entities/deck/ui/deck-read-detail";

export const metadata: Metadata = {
  title: "덱 상세",
};

type DeckReadPageProps = {
  params: Promise<{ deckId: string }>;
};

export default function DeckReadPage({ params }: DeckReadPageProps) {
  return (
    <Suspense fallback={<DeckReadDetailSkeleton />}>
      {params.then(({ deckId }) => (
        <DeckReadDetail deckId={Number(deckId)} />
      ))}
    </Suspense>
  );
}
