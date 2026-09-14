import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Card as CardType } from "@/entities/card/model/types";
import { cn } from "@/shared/ui/utils";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function ThoughtCard({
  card,
  cardClassName,
  onClick,
}: {
  card: CardType;
  cardClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        "w-full min-w-0 rounded-none border-0 bg-transparent p-0 shadow-none",
        onClick ? "cursor-pointer" : "",
        cardClassName
      )}
      onClick={onClick}
    >
      <CardHeader className="mb-6 flex flex-row items-start justify-between gap-2 p-0">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-[#77726b] dark:text-[#aaa49b]">
          <span className="truncate font-medium text-[#292724] dark:text-[#ebe7df]">
            {card.book?.title}
          </span>
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
              className="mt-0.5 h-2.5 w-2.5 shrink-0 cursor-default rounded-full bg-[#a45138] dark:bg-[#d77b5e]"
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
          <div className="mb-4 text-[11px] font-medium text-[#a45138] dark:text-[#d77b5e]">
            <span>
              {card.revisitReasonLabel}
            </span>
          </div>
        ) : null}
        <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <div>
            <p className="mb-3 text-[10px] text-[#77726b] dark:text-[#aaa49b]">
              책에서 가져온 문장
            </p>
            <h2 className="line-clamp-4 whitespace-pre-line font-serif text-xl font-medium leading-relaxed md:text-2xl">
              {card.quote ?? card.book?.title}
            </h2>
          </div>
          <div>
            <p className="mb-3 text-[10px] text-[#77726b] dark:text-[#aaa49b]">
              나의 생각
            </p>
            <p className="line-clamp-5 whitespace-pre-line text-sm leading-7 text-[#5f5b55] dark:text-[#c7c1b8]">
              {card.thought}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end">
          <span className="text-xs text-[#77726b] dark:text-[#aaa49b]">
            {card.createdAt
              ? `${dayjs(card.createdAt).fromNow()} 저장됨`
              : "저장됨"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
