import { useQuery } from "@tanstack/react-query";

import { getCardDetail, type ReqGetCardDetail } from "@/service/card/getCardDetail";
import { RQcardQueryKey } from "./RQcardQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useCardDetailQuery = (
  req: ReqGetCardDetail,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: RQcardQueryKey.detail(req.path.cardId),
    queryFn: () => getCardDetail(req),
    staleTime,
    gcTime,
    enabled: options?.enabled ?? true,
  });
};
