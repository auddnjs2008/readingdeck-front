import { CreateCardModal } from "@/components/card/create-card-modal";
import { Button } from "@/components/ui/button";

type Props = {
  cardCount: number;
};

export default function BookDetailCardsHeader({ cardCount }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reading Cards</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {cardCount} thoughts collected
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="gap-2 border-border/60 bg-card"
        >
          Filter
        </Button>
        <CreateCardModal />
      </div>
    </div>
  );
}
