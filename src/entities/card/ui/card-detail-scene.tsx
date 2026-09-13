"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { getCardDetail } from "@/entities/card/api/getCardDetail";
import { RQcardQueryKey } from "@/entities/card/model/queries/RQcardQueryKey";
import { QueryError } from "@/shared/ui/query-error";
import CardDetailView from "./card-detail-view";

type Props = {
  asModal?: boolean;
};

export default function CardDetailScene({
  asModal = false,
}: Props) {
  const params = useParams<{ cardId: string }>();
  const cardId = Number(params.cardId);
  const isValidCardId = Number.isSafeInteger(cardId) && cardId > 0;
  const { data: card, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: RQcardQueryKey.detail(cardId),
    queryFn: () => getCardDetail({ path: { cardId } }),
    enabled: isValidCardId,
  });

  if (!isValidCardId) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        잘못된 카드 주소입니다.
      </div>
    );
  }

  if (isError) return <QueryError onRetry={() => void refetch()} isRetrying={isFetching} />;
  if (isPending) {
    return (
      <div role="status" aria-label="카드를 불러오고 있습니다" className="flex min-h-[360px] animate-pulse flex-col gap-6 p-6">
        <div className="h-6 w-24 rounded-full bg-muted" />
        <div className="h-20 w-full rounded-xl bg-muted" />
        <div className="h-32 w-full rounded-xl bg-muted" />
      </div>
    );
  }

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
