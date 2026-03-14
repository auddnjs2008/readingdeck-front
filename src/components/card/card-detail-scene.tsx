"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useCardDetailQuery } from "@/hooks/card/react-query/useCardDetailQuery";
import CardDetailView from "./card-detail-view";

type Props = {
  cardId: number;
  asModal?: boolean;
};

export default function CardDetailScene({ cardId, asModal = false }: Props) {
  const router = useRouter();
  const isValidCardId = Number.isFinite(cardId) && cardId > 0;
  const { data, isPending, isError } = useCardDetailQuery(
    {
      path: { cardId: isValidCardId ? cardId : 0 },
    },
    {
      enabled: isValidCardId,
    }
  );

  if (!isValidCardId) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        잘못된 카드 주소입니다.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        카드를 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-destructive">
        카드를 불러오지 못했습니다.
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
        card={data}
        variant={asModal ? "modal" : "default"}
        onBookDetailClick={() => router.push(`/books/${data.book.id}`)}
      />
    </div>
  );
}
