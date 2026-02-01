import { useQuery } from "@tanstack/react-query";

import { getBookDetail, type ReqGetBookDetail } from "@/service/book/getBookDetail";
import { RQbookQueryKey } from "./RQbookQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useBookDetailQuery = (req: ReqGetBookDetail) => {
  return useQuery({
    queryKey: RQbookQueryKey.detail(req.path.bookId),
    queryFn: () => getBookDetail(req),
    staleTime,
    gcTime,
  });
};
