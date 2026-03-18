import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card as CardType } from "@/type/card";
import { cn } from "@/components/ui/utils";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const TYPE_DOT_CLASS: Record<string, string> = {
  insight: "bg-emerald-600 dark:bg-emerald-500",
  change: "bg-orange-600 dark:bg-orange-500",
  action: "bg-sky-600 dark:bg-sky-500",
  question: "bg-rose-600 dark:bg-rose-500",
  quote: "bg-sky-600 dark:bg-sky-500",
};

const REVISIT_REASON_CLASS: Record<string, string> = {
  recently_created:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  never_revisited:
    "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  stale_revisit:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  ready_to_revisit:
    "border-primary/20 bg-primary/10 text-primary",
};

export default function ThoughtCard({
  card,
  cardClassName,
  onClick,
}: {
  card: CardType;
  cardClassName?: string;
  onClick?: () => void;
}) {
  const typeDotClass = TYPE_DOT_CLASS[card.type] ?? "bg-muted";
  const revisitReasonClass =
    REVISIT_REASON_CLASS[card.revisitReason ?? ""] ??
    "border-border/60 bg-muted text-muted-foreground";

  return (
    <Card
      className={cn(
        "relative z-20 w-full min-w-[260px] max-w-[320px] p-5 shadow-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-paper-lg",
        onClick ? "cursor-pointer" : "",
        cardClassName
      )}
      onClick={onClick}
    >
      <CardHeader className="mb-3 flex flex-row items-start justify-between gap-2 p-0">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate font-medium text-foreground/80">{card.book?.title}</span>
          {card.book?.author && (
            <>
              <span>·</span>
              <span className="truncate">{card.book?.author}</span>
            </>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`h-5 w-5 shrink-0 cursor-default rounded-full border border-transparent ${typeDotClass}`}
              tabIndex={0}
              aria-label={`타입: ${card.type}`}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {card.revisitReasonLabel ? (
          <div className="mb-3">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight",
                revisitReasonClass
              )}
            >
              {card.revisitReasonLabel}
            </span>
          </div>
        ) : null}
        <CardTitle className="mb-2 line-clamp-2 whitespace-pre-line text-base leading-snug font-serif italic text-muted-foreground">
          {card.quote ?? card.book?.title}
        </CardTitle>
        <p className="mb-4 min-h-0 flex-1 line-clamp-3 whitespace-pre-line text-sm leading-relaxed">
          {card.thought}
        </p>
        <div className="mt-auto flex items-center justify-end border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {card.createdAt
              ? `${dayjs(card.createdAt).fromNow()} 저장됨`
              : "저장됨"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
