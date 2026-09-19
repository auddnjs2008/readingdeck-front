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
      <div
        role="status"
        aria-label="카드를 불러오고 있습니다"
        className={
          asModal
            ? "max-h-[90dvh] min-h-0 overflow-y-auto px-6 py-6 sm:px-8"
            : "min-h-[360px] px-1 py-2 sm:px-4 sm:py-4"
        }
      >
        <div className="animate-pulse space-y-8">
          <div className="flex gap-3">
            <div className="h-3 w-12 bg-muted" />
            <div className="h-3 w-10 bg-muted" />
          </div>
          <div className="h-4 w-40 bg-muted" />
          <div className="space-y-4">
            <div className="h-9 w-full bg-muted" />
            <div className="h-9 w-5/6 bg-muted" />
            <div className="h-9 w-2/3 bg-muted" />
          </div>
          <div className="space-y-3 border-l border-border pl-5 sm:pl-6">
            <div className="h-3 w-14 bg-muted" />
            <div className="h-5 w-11/12 bg-muted" />
            <div className="h-5 w-3/4 bg-muted" />
          </div>
          <div className="space-y-3 border-t border-border pt-7">
            <div className="h-6 w-1/2 bg-muted" />
            <div className="h-4 w-2/3 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
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
