"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import {
  CARD_FILTER_TYPE_IDS,
  type CardFilterProps,
  type CardFilterSort,
} from "@/components/card/card-fiilter";
import { useInfiniteBookCardsQuery } from "@/hooks/book/react-query/useInfiniteBookCardsQuery";
import type { BookDetailCardItem } from "../types";
import type { ResGetBookCards } from "@/service/book/getBookCards";
import BookDetailCardList from "../book-detail-card-list";
import BookDetailCardsHeader from "../book-detail-cards-header";

const API_CARD_TYPES = ["insight", "change", "action", "question"] as const;

function mapApiItemsToCardItems(
  items: ResGetBookCards["items"]
): BookDetailCardItem[] {
  return items.map((item) => ({
    id: item.id,
    type: item.type,
    quote: item.quote ?? undefined,
    thought: item.thought,
    backgroundImage: undefined,
  }));
}

function buildQueryTypes(selectedTypeIds: string[]) {
  const apiTypes = selectedTypeIds.filter((id) =>
    API_CARD_TYPES.includes(id as (typeof API_CARD_TYPES)[number])
  );
  if (apiTypes.length === 0 || apiTypes.length === API_CARD_TYPES.length) {
    return undefined;
  }
  return apiTypes as ("insight" | "change" | "action" | "question")[];
}

export default function BookDetailContent() {
  const params = useParams();
  const bookId = params.id as string;
  const id = Number(bookId);

  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>(
    () => [...CARD_FILTER_TYPE_IDS]
  );
  const [sort, setSort] = useState<CardFilterSort>("latest");
  const [hasQuote, setHasQuote] = useState<boolean | undefined>(undefined);

  const queryFilter = useMemo(
    () => ({
      take: 10 as const,
      types: buildQueryTypes(selectedTypeIds),
      sort,
      hasQuote,
    }),
    [selectedTypeIds, sort, hasQuote]
  );

  const {
    data,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteBookCardsQuery({
    path: { bookId: id },
    query: queryFilter,
  });

  const cards: BookDetailCardItem[] =
    data?.pages.flatMap((page) => mapApiItemsToCardItems(page.items)) ?? [];
  const cardCount = cards.length;

  const filterProps: CardFilterProps = useMemo(
    () => ({
      selectedTypeIds,
      onTypeIdsChange: setSelectedTypeIds,
      sort,
      onSortChange: setSort,
      hasQuote,
      onHasQuoteChange: setHasQuote,
    }),
    [selectedTypeIds, sort, hasQuote]
  );

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <BookDetailCardsHeader cardCount={cardCount} />
      <BookDetailCardList
        cards={cards}
        isPending={isPending}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        filterProps={filterProps}
      />
    </main>
  );
}
