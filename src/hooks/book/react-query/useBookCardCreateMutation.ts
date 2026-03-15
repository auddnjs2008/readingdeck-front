import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { createBookCard } from "@/service/book/createBookCard";
import type { ResGetBookCards } from "@/service/book/getBookCards";
import { RQbookQueryKey } from "./RQbookQueryKey";

type BookCardsInfiniteData = InfiniteData<ResGetBookCards, number | undefined>;

const matchesCardFilters = (
  card: ResGetBookCards["items"][number],
  query: {
    types?: ("insight" | "change" | "action" | "question")[];
    hasQuote?: boolean;
    pageStart?: number;
    pageEnd?: number;
  }
) => {
  if (query.types?.length && !query.types.includes(card.type)) return false;
  if (query.hasQuote === true && !card.quote) return false;
  if (query.hasQuote === false && card.quote) return false;
  if (query.pageStart != null && (card.pageStart ?? 0) < query.pageStart) {
    return false;
  }
  if (
    query.pageEnd != null &&
    (card.pageEnd ?? card.pageStart ?? Number.MAX_SAFE_INTEGER) > query.pageEnd
  ) {
    return false;
  }

  return true;
};

export const useBookCardCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookCard,
    onMutate: async (variables) => {
      const cardsQueryKey = RQbookQueryKey.cards(variables.path.bookId);
      await queryClient.cancelQueries({ queryKey: cardsQueryKey });

      const previousQueries = queryClient.getQueriesData<BookCardsInfiniteData>(
        {
          queryKey: cardsQueryKey,
        }
      );

      const optimisticCard: ResGetBookCards["items"][number] = {
        id: -Date.now(),
        type: variables.body.type,
        quote: variables.body.quote?.trim() || null,
        thought: variables.body.thought,
        pageStart: variables.body.pageStart ?? null,
        pageEnd: variables.body.pageEnd ?? null,
      };

      previousQueries.forEach(([queryKey, data]) => {
        if (!data) return;

        const query = (queryKey[3] ?? {}) as {
          sort?: "latest" | "oldest";
          types?: ("insight" | "change" | "action" | "question")[];
          hasQuote?: boolean;
          pageStart?: number;
          pageEnd?: number;
        };

        if (!matchesCardFilters(optimisticCard, query)) return;

        queryClient.setQueryData<BookCardsInfiniteData>(queryKey, {
          ...data,
          pages: data.pages.map((page, index) => {
            if (index !== 0) return page;

            const items =
              query.sort === "oldest"
                ? [...page.items, optimisticCard]
                : [optimisticCard, ...page.items];

            return {
              ...page,
              items,
            };
          }),
        });
      });

      return { previousQueries, optimisticCardId: optimisticCard.id };
    },
    onError: (_error, variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      queryClient.invalidateQueries({
        queryKey: RQbookQueryKey.cards(variables.path.bookId),
      });
    },
    onSuccess: (data, variables, context) => {
      const cardsQueryKey = RQbookQueryKey.cards(variables.path.bookId);
      const serverCard: ResGetBookCards["items"][number] = {
        id: data.id,
        type: data.type,
        quote: data.quote,
        thought: data.thought,
        pageStart: data.pageStart,
        pageEnd: data.pageEnd,
      };

      const queries = queryClient.getQueriesData<BookCardsInfiniteData>({
        queryKey: cardsQueryKey,
      });

      queries.forEach(([queryKey, cached]) => {
        if (!cached) return;

        queryClient.setQueryData<BookCardsInfiniteData>(queryKey, {
          ...cached,
          pages: cached.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === context?.optimisticCardId ? serverCard : item
            ),
          })),
        });
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: RQbookQueryKey.cards(variables.path.bookId),
      });
    },
  });
};
