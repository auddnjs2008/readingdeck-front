import fetcher from "@/shared/api/fetcher";
import type { CommunityComment } from "@/entities/community/model/types";

export type ReqGetCommunityComments = {
  path: {
    postId: number;
  };
};

export const getCommunityComments = async (req: ReqGetCommunityComments) => {
  const result = await fetcher.get<CommunityComment[]>(
    `/community/posts/${req.path.postId}/comments`,
  );
  return result.data;
};
