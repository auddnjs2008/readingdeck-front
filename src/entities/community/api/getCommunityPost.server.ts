import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";

import type {
  ReqGetCommunityPost,
} from "@/entities/community/api/getCommunityPost";
import type { CommunityPostDetail } from "@/entities/community/model/types";
import { serverFetcher } from "@/shared/api/server-fetcher";

const getPost = cache(async (postId: number) => {
  if (!Number.isSafeInteger(postId) || postId <= 0) notFound();
  return serverFetcher<CommunityPostDetail>(
    `/community/posts/${postId}`
  );
});

export const getCommunityPostServer = (req: ReqGetCommunityPost) =>
  getPost(req.path.postId);
