import { useQuery } from "@tanstack/react-query";

import {
  getTodayCards,
  type ReqGetTodayCards,
} from "@/entities/card/api/getTodayCards";
import { RQcardQueryKey } from "./RQcardQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useTodayCardsQuery = (req?: ReqGetTodayCards) => {
  return useQuery({
    queryKey: RQcardQueryKey.today(req),
    queryFn: () => getTodayCards(req),
    staleTime,
    gcTime,
  });
};
