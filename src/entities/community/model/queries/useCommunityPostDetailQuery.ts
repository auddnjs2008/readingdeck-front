import { useQuery } from "@tanstack/react-query";

import {
  getCommunityPost,
  type ReqGetCommunityPost,
} from "@/entities/community/api/getCommunityPost";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useCommunityPostDetailQuery = (
  req: ReqGetCommunityPost,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: RQcommunityQueryKey.detail(req.path.postId),
    queryFn: () => getCommunityPost(req),
    enabled: options?.enabled ?? true,
    staleTime,
    gcTime,
  });
};
