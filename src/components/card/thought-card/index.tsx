import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/type/card";
import { cardStyles } from "../card-style";

export default function ThoughtCard({ card }: { card: CardType }) {
  console.log(cardStyles[card.type].tagClass);
  return (
    <Card
      key={card.id}
      className="group flex min-w-[280px] flex-1 flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 dark:border-transparent"
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(${card.book?.backgroundImage})`,
          }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
              cardStyles[card.type].tagClass
            }`}
          >
            {card.type}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5 pt-1">
        <div>
          <h3 className="mb-1 text-lg font-bold leading-tight text-foreground">
            {card.book?.title}
          </h3>
          <p className="text-sm font-normal leading-normal text-muted-foreground">
            {card.quote ?? card.thought}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          {/* {card.footerLeft} */}
          <Button
            variant="ghost"
            size="sm"
            className="px-0 text-primary hover:bg-transparent"
          >
            Read
          </Button>
        </div>
      </div>
    </Card>
  );
}
