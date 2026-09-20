import { CreateCardModal } from "@/features/card/create-card/ui";

type Props = {
  bookId: number;
  cardCount: number;
};

export default function BookDetailCardsHeader({ bookId, cardCount }: Props) {
  return (
    <div className="mb-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold leading-tight">독서 카드</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {cardCount}개의 생각
          </p>
        </div>
        <CreateCardModal bookId={bookId} />
      </div>
    </div>
  );
}
