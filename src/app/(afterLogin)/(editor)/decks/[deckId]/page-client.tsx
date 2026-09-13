"use client";

import { useParams } from "next/navigation";

import DeckCreateClient from "@/widgets/deck-editor/deck-create-client";
import { useDeckDetailQuery } from "@/entities/deck/model/queries/useDeckDetailQuery";
import { QueryError } from "@/shared/ui/query-error";

export default function DeckDetailPageClient() {
  const params = useParams<{ deckId: string }>();
  const parsedDeckId = Number(params?.deckId);
  const isValidDeckId = Number.isSafeInteger(parsedDeckId) && parsedDeckId > 0;

  const { data, isPending, isError, isFetching, refetch } = useDeckDetailQuery(
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
        잘못된 덱 주소입니다.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        덱을 불러오고 있습니다...
      </div>
    );
  }

  if (isError || !data) {
    return <QueryError onRetry={() => void refetch()} isRetrying={isFetching} />;
  }

  return <DeckCreateClient key={data.id} initialDeckDetail={data} />;
}
