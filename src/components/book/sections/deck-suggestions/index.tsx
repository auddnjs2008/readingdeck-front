"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bot, Layers3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SafeImage from "@/components/ui/safe-image";
import { cn } from "@/components/ui/utils";
import { useDeckCreateMutation } from "@/hooks/deck/react-query/useDeckCreateMutation";
import { useMyHomeSummaryQuery } from "@/hooks/me/react-query/useMyHomeSummaryQuery";
import { getDeckHref } from "@/service/deck/getDeckHref";

const CARD_TYPE_LABEL: Record<string, string> = {
  insight: "인사이트",
  change: "변화",
  action: "실천",
  question: "질문",
};

const CARD_TYPE_STYLE: Record<string, string> = {
  insight:
    "border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
  change:
    "border-amber-500/20 bg-amber-500/8 text-amber-700 dark:text-amber-300",
  action:
    "border-sky-500/20 bg-sky-500/8 text-sky-700 dark:text-sky-300",
  question:
    "border-rose-500/20 bg-rose-500/8 text-rose-700 dark:text-rose-300",
};

const DECK_SUGGESTION_COPY = {
  title: "덱으로 묶어볼 카드",
  description: "아직 덱에 담지 않은 카드가 쌓였어요. 초안 덱으로 바로 정리해보세요.",
  badge: "추천 덱",
  createButton: "초안 덱 만들기",
  createHelp: "생성 후 편집 화면에서 리스트 초안을 계속 다듬을 수 있어요.",
};

export default function DeckSuggestionsSection() {
  const router = useRouter();
  const { data, isPending, isError } = useMyHomeSummaryQuery();
  const createDeckMutation = useDeckCreateMutation();

  const suggestions = data?.deckSuggestions ?? [];

  if (isPending || isError || suggestions.length === 0) {
    return null;
  }

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
        onSuccess: (deck) => {
          router.push(getDeckHref({ id: deck.id, status: deck.status }));
        },
        onError: () => {
          toast.error("덱 초안 생성에 실패했습니다.");
        },
      }
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 px-2 pt-1">
        <div className="flex flex-col">
          <h2 className="font-serif text-[24px] font-bold leading-tight tracking-tight text-foreground">
            {DECK_SUGGESTION_COPY.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {DECK_SUGGESTION_COPY.description}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.bookId}
            className="overflow-hidden rounded-[30px] border border-[rgba(128,108,93,0.22)] bg-[linear-gradient(135deg,rgba(252,248,243,0.98),rgba(246,239,231,0.96))] shadow-[0_1px_0_rgba(255,255,255,0.75),0_18px_40px_rgba(88,66,52,0.08)] dark:border-[color:var(--border)] dark:bg-[linear-gradient(135deg,rgba(47,42,38,0.98),rgba(37,33,30,0.96))] dark:shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_14px_34px_rgba(16,24,40,0.18),inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <CardContent className="p-5 md:p-7">
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
                <div className="flex min-w-0 flex-col gap-5">
                  <div className="flex min-w-0 gap-4">
                    <div className="relative h-[120px] w-[84px] shrink-0 overflow-hidden rounded-2xl border border-[rgba(128,108,93,0.18)] bg-white/70 shadow-[0_10px_22px_rgba(88,66,52,0.12)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_12px_24px_rgba(0,0,0,0.18)] sm:h-[144px] sm:w-[102px]">
                      {suggestion.backgroundImage ? (
                        <SafeImage
                          src={suggestion.backgroundImage}
                          alt={suggestion.bookTitle}
                          fill
                          sizes="(max-width: 640px) 84px, 102px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                          No Cover
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-blue)]/22 bg-[color:var(--color-accent-blue)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent-blue)] dark:border-[color:var(--color-accent-blue)]/20 dark:bg-[color:var(--color-accent-blue)]/8 dark:text-[color:var(--color-accent-blue)]/90">
                          <Bot className="h-3.5 w-3.5" />
                          {DECK_SUGGESTION_COPY.badge}
                        </div>
                        <span className="rounded-full border border-[rgba(128,108,93,0.18)] bg-[rgba(120,94,73,0.06)] px-3 py-1 text-xs font-medium text-muted-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-white/62">
                          카드 {suggestion.candidateCardCount}장
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-[22px] font-semibold leading-tight text-foreground">
                          {suggestion.bookTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.bookAuthor}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[rgba(128,108,93,0.18)] bg-[rgba(120,94,73,0.05)] px-4 py-4 dark:border-white/8 dark:bg-white/[0.03]">
                    <p className="text-sm leading-relaxed text-foreground/88 dark:text-foreground/85">
                      아직 덱에 담기지 않은 카드{" "}
                      <span className="font-semibold text-foreground">
                        {suggestion.candidateCardCount}장
                      </span>
                      이 쌓였어요. 지금 리스트 초안으로 묶어두고 흐름을 먼저 정리해보세요.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      className="h-14 rounded-2xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[0_12px_28px_rgba(212,117,88,0.28)] hover:bg-primary/90"
                      disabled={createDeckMutation.isPending}
                      onClick={() => handleCreateDeck(suggestion)}
                    >
                      <Layers3 className="mr-2 h-4 w-4" />
                      {DECK_SUGGESTION_COPY.createButton}
                    </Button>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {DECK_SUGGESTION_COPY.createHelp}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {suggestion.cards.map((card, index) => (
                    <div
                      key={card.id}
                      className="rounded-[22px] border border-[rgba(128,108,93,0.18)] bg-[linear-gradient(180deg,rgba(255,252,248,0.92),rgba(247,240,233,0.88))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
                            CARD_TYPE_STYLE[card.type] ??
                            "border-[rgba(128,108,93,0.16)] bg-[rgba(120,94,73,0.04)] text-muted-foreground dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                          )}
                        >
                          {CARD_TYPE_LABEL[card.type] ?? card.type}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          Card #{index + 1}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-base leading-relaxed text-foreground/90 dark:text-foreground/90">
                        {card.quote ?? card.thought}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
