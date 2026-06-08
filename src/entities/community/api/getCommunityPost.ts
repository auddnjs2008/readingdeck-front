import fetcher from "@/shared/api/fetcher";
import type { CommunityPostDetail } from "@/entities/community/model/types";

export type ReqGetCommunityPost = {
  path: {
    postId: number;
  };
};

export const getCommunityPost = async (req: ReqGetCommunityPost) => {
  const result = await fetcher.get<CommunityPostDetail>(
    `/community/posts/${req.path.postId}`,
  );
  return result.data;
};
