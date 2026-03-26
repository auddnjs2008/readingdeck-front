import { useQuery } from "@tanstack/react-query";

import {
  getCommunityComments,
  type ReqGetCommunityComments,
} from "@/service/community/getCommunityComments";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

const staleTime = 30 * 1000;
const gcTime = 5 * 60 * 1000;

export const useCommunityCommentsQuery = (
  req: ReqGetCommunityComments,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: RQcommunityQueryKey.comments(req.path.postId),
    queryFn: () => getCommunityComments(req),
    enabled: options?.enabled ?? true,
    staleTime,
    gcTime,
  });
};
