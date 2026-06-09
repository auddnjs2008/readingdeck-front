import { redirect } from "next/navigation";

import { getDeckDetailServer } from "@/entities/deck/api/getDeckDetail.server";
import { DeckReadViewer } from "@/entities/deck/ui/deck-read-viewer";

type DeckReadDetailProps = {
  deckId: number;
};

export async function DeckReadDetail({ deckId }: DeckReadDetailProps) {
  if (!Number.isFinite(deckId) || deckId <= 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        잘못된 덱 주소입니다.
      </div>
    );
  }

  const deck = await getDeckDetailServer({ path: { deckId } });

  if (deck.status === "draft") {
    redirect(`/decks/${deck.id}/edit`);
  }

  return <DeckReadViewer deck={deck} />;
}

export function DeckReadDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-full bg-muted" />
            <div className="h-10 w-24 rounded-full bg-muted" />
          </div>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_14px_40px_rgba(63,54,49,0.08)]">
          <div className="border-b border-border px-6 py-8 md:px-8">
            <div className="mb-4 flex gap-2">
              <div className="h-7 w-28 rounded-full bg-muted" />
              <div className="h-7 w-24 rounded-full bg-muted" />
            </div>
            <div className="h-12 w-full max-w-xl rounded-full bg-muted" />
            <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-muted" />
          </div>
          <div className="px-6 py-8 md:px-8">
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-border bg-background px-5 py-5 md:px-6 md:py-6"
                >
                  <div className="mb-4 flex gap-3">
                    <div className="h-6 w-12 rounded-full bg-muted" />
                    <div className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-full rounded-full bg-muted" />
                  <div className="mt-3 h-5 w-2/3 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
