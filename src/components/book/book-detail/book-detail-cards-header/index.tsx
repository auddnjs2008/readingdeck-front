import { CreateCardModal } from "@/components/card/create-card-modal";
import { Feather } from "lucide-react";

type Props = {
  bookId: number;
  cardCount: number;
};

export default function BookDetailCardsHeader({ bookId, cardCount }: Props) {
  return (
    <div className="mb-8 rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(244,238,232,0.12),rgba(193,92,61,0.03))] p-5 shadow-[0_10px_24px_rgba(63,54,49,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-serif">
              독서 카드
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              생각 {cardCount}개 수집
            </p>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            인상 깊은 문장과 떠오른 생각을 바로 카드로 남겨두세요.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <CreateCardModal bookId={bookId} />
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Feather className="h-3.5 w-3.5" />
            지금 기록해두면 덱으로 이어가기 쉬워져요.
          </div>
        </div>
      </div>
    </div>
  );
}
