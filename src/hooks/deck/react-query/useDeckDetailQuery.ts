import { useQuery } from "@tanstack/react-query";

import { getDeckDetail, type ReqGetDeckDetail } from "@/service/deck/getDeckDetail";
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
    enabled: options?.enabled ?? true,
    staleTime,
    gcTime,
  });
};
