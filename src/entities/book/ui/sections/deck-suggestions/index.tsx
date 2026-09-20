"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ResGetMyHomeSummary } from "@/entities/me/api/getMyHomeSummary";
import { getDeckHref } from "@/entities/deck/api/getDeckHref";
import { useDeckCreateMutation } from "@/entities/deck/model/queries/useDeckCreateMutation";
import { Button } from "@/shared/ui/button";

type DeckSuggestionsSectionProps = {
  homeSummary: ResGetMyHomeSummary;
};

export default function DeckSuggestionsSection({ homeSummary }: DeckSuggestionsSectionProps) {
  const router = useRouter();
  const createDeckMutation = useDeckCreateMutation();
  const suggestions = homeSummary.deckSuggestions;

  if (suggestions.length === 0) return null;

  const handleCreateDeck = (suggestion: (typeof suggestions)[number]) => {
    createDeckMutation.mutate(
      {
        body: {
          name: `${suggestion.bookTitle} 인사이트 덱`,
          mode: "list",
          nodes: suggestion.candidateCardIds.map((cardId, index) => ({
            clientKey: `suggested-card-${cardId}`,
            type: "card",
            cardId,
            positionX: 0,
            positionY: index * 120,
            order: index,
          })),
        },
      },
      {
        onSuccess: (deck) => router.push(getDeckHref({ id: deck.id, status: deck.status })),
        onError: () => toast.error("덱 초안 생성에 실패했습니다."),
      }
    );
  };

  return (
    <section className="flex flex-col">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight">덱으로 묶어볼 카드</h2>
        <p className="mt-1 text-sm text-[#77726b] dark:text-[#aaa49b]">
          아직 덱에 담지 않은 카드를 하나의 흐름으로 정리해 보세요.
        </p>
      </div>

      <div>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.bookId}
            className="grid gap-4 border-b border-border/60 px-4 py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center"
          >
            <div>
              <p className="text-[10px] text-[#77726b] dark:text-[#aaa49b]">
                카드 {suggestion.candidateCardCount}장
              </p>
              <h3 className="mt-1 font-serif text-lg font-semibold">{suggestion.bookTitle}</h3>
              <p className="mt-1 text-xs text-[#77726b] dark:text-[#aaa49b]">{suggestion.bookAuthor}</p>
            </div>
            <p className="text-sm leading-relaxed text-[#77726b] dark:text-[#aaa49b]">
              아직 덱에 담지 않은 카드가 쌓였어요. 하나의 흐름으로 정리해 보세요.
            </p>
            <Button
              type="button"
              className="w-full rounded-[4px] bg-[#a45138] text-white shadow-none hover:bg-[#8e432f] md:w-auto dark:bg-[#d77b5e] dark:hover:bg-[#c66e53]"
              disabled={createDeckMutation.isPending}
              onClick={() => handleCreateDeck(suggestion)}
            >
              초안 덱 만들기
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
