import { useQuery } from "@tanstack/react-query";

import { getDeckDetail, type ReqGetDeckDetail } from "@/entities/deck/api/getDeckDetail";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useDeckDetailQuery = (
  req: ReqGetDeckDetail,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: RQdeckQueryKey.detail(req.path.deckId),
    queryFn: () => getDeckDetail(req),
    enabled: Number.isSafeInteger(req.path.deckId) && req.path.deckId > 0 && (options?.enabled ?? true),
    staleTime,
    gcTime,
  });
};
