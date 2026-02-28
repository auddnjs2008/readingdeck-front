import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import { Badge } from "@/components/ui/badge";
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
  insight: "bg-emerald-500",
  change: "bg-amber-500",
  action: "bg-blue-500",
  question: "bg-purple-500",
  quote: "bg-blue-500",
};

export default function ThoughtCard({
  card,
  cardClassName,
}: {
  card: CardType;
  cardClassName?: string;
}) {
  const typeDotClass = TYPE_DOT_CLASS[card.type] ?? "bg-muted";

  return (
    <Card
      className={cn(
        "relative z-20 w-full min-w-[260px] max-w-[320px] p-5 shadow-paper transition-transform duration-300 hover:-translate-y-1 hover:shadow-paper-lg",
        cardClassName
      )}
    >
      <CardHeader className="mb-3 flex flex-row items-start justify-between gap-2 p-0">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          <Badge variant="info" className="text-primary">
            {card.book?.title}
          </Badge>
          <Badge>{card.book?.author}</Badge>
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
        <CardTitle className="mb-2 line-clamp-2 text-base leading-snug font-serif italic text-muted-foreground">
          {card.quote ?? card.book?.title}
        </CardTitle>
        <p className="mb-4 min-h-0 flex-1 line-clamp-3 text-sm leading-relaxed">
          {card.thought}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
            <div className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
          </div>
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
