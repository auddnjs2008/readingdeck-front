import "server-only";

import type {
  ReqGetCommunityPost,
} from "@/entities/community/api/getCommunityPost";
import type { CommunityPostDetail } from "@/entities/community/model/types";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getCommunityPostServer = async (req: ReqGetCommunityPost) => {
  return serverFetcher<CommunityPostDetail>(
    `/community/posts/${req.path.postId}`
  );
};
