"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeckDetailQuery } from "@/entities/deck/model/queries/useDeckDetailQuery";
import { QueryError } from "@/shared/ui/query-error";
import { DeckReadViewer } from "@/entities/deck/ui/deck-read-viewer";

export function DeckReadDetail() {
  const params = useParams<{ deckId: string }>();
  const router = useRouter();
  const deckId = Number(params.deckId);
  const validId = Number.isSafeInteger(deckId) && deckId > 0;
  const { data: deck, isPending, isError, isFetching, refetch } = useDeckDetailQuery({ path: { deckId } });

  useEffect(() => {
    if (!isError && deck?.status === "draft") router.replace(`/decks/${deck.id}/edit`);
  }, [deck?.id, deck?.status, isError, router]);

  if (!validId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        잘못된 덱 주소입니다.
      </div>
    );
  }

  if (isError) return <QueryError onRetry={() => void refetch()} isRetrying={isFetching} />;
  if (isPending || deck.status === "draft") return <DeckReadDetailSkeleton />;

  return <DeckReadViewer key={deck.id} deck={deck} />;
}

export function DeckReadDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="덱 불러오는 중" className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-5 py-10 md:px-8 md:py-14">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-24 rounded-sm bg-muted" />
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded-sm bg-muted" />
            <div className="hidden h-9 w-20 rounded-sm bg-muted md:block" />
          </div>
        </div>

        <section>
          <div>
            <div className="h-9 w-full max-w-sm rounded-sm bg-muted" />
            <div className="mt-2 h-3 w-28 rounded-sm bg-muted" />
            <div className="mt-5 h-5 w-full max-w-xl rounded-sm bg-muted" />
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-b border-border/70 py-6 last:border-0"
                >
                  <div className="mb-4 flex gap-3">
                    <div className="h-3 w-12 rounded-sm bg-muted" />
                    <div className="h-3 w-20 rounded-sm bg-muted" />
                  </div>
                  <div className="h-5 w-full rounded-sm bg-muted" />
                  <div className="mt-3 h-5 w-2/3 rounded-sm bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
