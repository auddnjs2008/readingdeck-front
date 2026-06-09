import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCardDetailServer } from "@/entities/card/api/getCardDetail.server";
import CardDetailView from "./card-detail-view";

type Props = {
  cardId: number;
  asModal?: boolean;
};

export default async function CardDetailScene({
  cardId,
  asModal = false,
}: Props) {
  const isValidCardId = Number.isFinite(cardId) && cardId > 0;

  if (!isValidCardId) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        잘못된 카드 주소입니다.
      </div>
    );
  }

  const card = await getCardDetailServer({ path: { cardId } });

  return (
    <div className="flex flex-col gap-5">
      {asModal ? null : (
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          책 페이지로
        </Link>
      )}

      <CardDetailView
        card={card}
        variant={asModal ? "modal" : "default"}
        bookDetailHref={`/books/${card.book.id}`}
      />
    </div>
  );
}
