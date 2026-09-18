import type { DeckGraphNode } from "@/entities/deck/model/types";
import {
  CARD_LABELS,
  formatPageRange,
  getOrderedCardNodes,
} from "@/entities/deck/lib/deck-read-viewer";

type DeckReadCardListProps = {
  nodes: DeckGraphNode[];
};

export function DeckReadCardList({ nodes }: DeckReadCardListProps) {
  const orderedCardNodes = getOrderedCardNodes(nodes);

  if (orderedCardNodes.length === 0) {
    return (
      <div className="py-14 text-center text-sm text-muted-foreground">
        아직 순서대로 읽을 카드가 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/70">
      {orderedCardNodes.map((node, index) => {
        if (!node.card) return null;

        const pageRange = formatPageRange(
          node.card.pageStart,
          node.card.pageEnd
        );
        const displayTitle = node.card.title?.trim() || null;

        return (
          <article
            key={node.id}
            className="min-w-0 py-8 first:pt-0 md:py-10 [overflow-wrap:anywhere]"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className="text-xs font-medium text-primary"
              >
                {CARD_LABELS[node.card.type] ?? node.card.type}
              </span>
            </div>

            {displayTitle ? (
              <p className="mb-3 text-sm font-bold text-foreground">
                {displayTitle}
              </p>
            ) : null}

            <p className="whitespace-pre-line font-serif text-lg leading-8 text-foreground md:text-xl md:leading-9">
              {node.card.thought}
            </p>
            {node.card.quote ? (
              <blockquote className="mt-6 border-l-2 border-primary/30 pl-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">원문 인용</p>
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{node.card.quote}</p>
              </blockquote>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {node.book?.title ? (
                <span>
                  {node.book.title}
                  {node.book.author ? ` · ${node.book.author}` : ""}
                </span>
              ) : null}
              {pageRange ? (
                <span>
                  {pageRange}
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
