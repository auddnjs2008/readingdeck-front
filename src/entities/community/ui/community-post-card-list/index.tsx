import type { CommunityPostSnapshotNode } from "@/entities/community/model/types";
import {
  CARD_LABELS,
  formatPageRange,
} from "@/entities/community/lib/community-post-reader";

type CommunityPostCardListProps = {
  nodes: CommunityPostSnapshotNode[];
};

export function CommunityPostCardList({ nodes }: CommunityPostCardListProps) {
  const cardNodes = nodes
    .filter((node) => node.type === "card" && node.card)
    .sort((a, b) => a.order - b.order);

  if (cardNodes.length === 0) {
    return (
      <div className="border-y border-border/70 px-6 py-14 text-center text-sm text-muted-foreground">
        아직 순서대로 읽을 카드가 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/70 border-y border-border/70">
      {cardNodes.map((node, index) => {
        if (!node.card) return null;

        const pageRange = formatPageRange(
          node.card.pageStart,
          node.card.pageEnd
        );

        return (
          <article
            key={node.id}
            className="py-7 md:py-9"
          >
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold">
                {CARD_LABELS[node.card.type] ?? node.card.type}
              </span>
              {node.book?.title ? (
                <span>
                  {node.book.title}
                  {node.book.author ? ` · ${node.book.author}` : ""}
                </span>
              ) : null}
              {pageRange ? <span>{pageRange}</span> : null}
            </div>

            {node.card.quote ? (
              <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 whitespace-pre-line text-[17px] font-medium leading-8 text-foreground md:text-[19px]">
                {node.card.quote}
              </blockquote>
            ) : null}

            <p className="whitespace-pre-line text-[15px] leading-8 text-foreground/90">
              {node.card.thought}
            </p>

          </article>
        );
      })}
    </div>
  );
}
