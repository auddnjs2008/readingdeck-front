import { cardStyles } from "@/components/card/card-style";
import type { BookDetailCardItem } from "../types";

type Props = {
  card: BookDetailCardItem;
};

const defaultStyle = {
  badgeClass: "bg-muted text-muted-foreground border-border",
  borderClass: "",
};

export default function BookDetailCard({ card }: Props) {
  const styles =
    card.type in cardStyles
      ? cardStyles[card.type as keyof typeof cardStyles]
      : defaultStyle;

  return (
    <div
      className={`group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card/80 p-8 shadow-paper transition-all hover:-translate-y-1 hover:shadow-paper-lg ${styles.borderClass}`}
    >
      {card.backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(${card.backgroundImage})`,
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/70 to-background/95" />
        </>
      ) : null}
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badgeClass}`}
          >
            {card.type}
          </span>
        </div>

        {card.quote ? (
          <div className="border-l-2 border-primary/40 pl-6">
            <p className="text-lg font-medium font-serif italic leading-relaxed text-foreground">
              &ldquo;{card.quote}&rdquo;
            </p>
          </div>
        ) : null}

        <p className="text-lg font-medium leading-relaxed text-foreground/90">
          {card.thought}
        </p>

        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Card #{card.id}
          </span>
          {card.pageStart != null ? (
            <span className="text-[11px] text-muted-foreground">
              {card.pageEnd != null && card.pageEnd !== card.pageStart
                ? `p.${card.pageStart}–${card.pageEnd}`
                : `p.${card.pageStart}`}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
