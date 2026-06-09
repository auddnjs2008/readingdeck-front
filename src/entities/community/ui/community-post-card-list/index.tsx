import type { CommunityPostSnapshotNode } from "@/entities/community/model/types";
import {
  CARD_BADGE_CLASSES,
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
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center text-sm text-muted-foreground">
        아직 순서대로 읽을 카드가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {cardNodes.map((node, index) => {
        if (!node.card) return null;

        const badgeClass =
          CARD_BADGE_CLASSES[node.card.type] ??
          "border-border/60 bg-muted/50 text-muted-foreground";
        const pageRange = formatPageRange(
          node.card.pageStart,
          node.card.pageEnd
        );

        return (
          <article
            key={node.id}
            className="rounded-[24px] border border-border bg-background px-5 py-5 shadow-[0_8px_24px_rgba(63,54,49,0.05)] transition-colors hover:border-primary/20 md:px-6 md:py-6"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}
              >
                {CARD_LABELS[node.card.type] ?? node.card.type}
              </span>
            </div>

            {node.card.quote ? (
              <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 whitespace-pre-line text-[17px] font-medium leading-8 text-foreground md:text-[19px]">
                {node.card.quote}
              </blockquote>
            ) : null}

            <p className="whitespace-pre-line text-[15px] leading-8 text-foreground/90">
              {node.card.thought}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {node.book?.title ? (
                <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1.5">
                  {node.book.title}
                  {node.book.author ? ` · ${node.book.author}` : ""}
                </span>
              ) : null}
              {pageRange ? (
                <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1.5">
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
