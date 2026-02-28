import { CreateCardModal } from "@/components/card/create-card-modal";
import { Button } from "@/components/ui/button";

type Props = {
  bookId: number;
  cardCount: number;
};

export default function BookDetailCardsHeader({ bookId, cardCount }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-serif">독서 카드</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          생각 {cardCount}개 수집
        </p>
      </div>
      <div className="flex">
        <CreateCardModal bookId={bookId} />
      </div>
    </div>
  );
}
