import { useQuery } from "@tanstack/react-query";

import { getDecks, type ReqGetDecks } from "@/service/deck/getDecks";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

const staleTime = 60 * 1000;
const gcTime = 5 * 60 * 1000;

export const useDecksQuery = (req?: ReqGetDecks) => {
  return useQuery({
    queryKey: RQdeckQueryKey.list(req),
    queryFn: () => getDecks(req),
    staleTime,
    gcTime,
  });
};
