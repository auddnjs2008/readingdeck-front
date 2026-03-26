import fetcher from "../fetcher";
import type { CommunityPostDetail } from "./types";

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
