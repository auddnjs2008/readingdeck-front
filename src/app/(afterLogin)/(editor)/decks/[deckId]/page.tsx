"use client";

import { useParams } from "next/navigation";

import DeckCreateClient from "@/components/deck/create/deck-create-client";
import { useDeckDetailQuery } from "@/hooks/deck/react-query/useDeckDetailQuery";

export default function DeckDetailPage() {
  const params = useParams<{ deckId: string }>();
  const parsedDeckId = Number(params?.deckId);
  const isValidDeckId = Number.isFinite(parsedDeckId) && parsedDeckId > 0;

  const { data, isPending, isError } = useDeckDetailQuery(
    {
      path: { deckId: isValidDeckId ? parsedDeckId : 0 },
    },
    {
      enabled: isValidDeckId,
    }
  );

  if (!isValidDeckId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        Invalid deck id.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        Loading deck...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-destructive">
        Failed to load deck.
      </div>
    );
  }

  return <DeckCreateClient initialDeckDetail={data} />;
}
