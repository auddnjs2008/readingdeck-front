import fetcher from "@/shared/api/fetcher";
import type { CommunityPost } from "@/entities/community/model/types";

export type ReqCreateCommunityPost = {
  body: {
    deckId: number;
    caption?: string;
  };
};

export type ResCreateCommunityPost = CommunityPost;

export const createCommunityPost = async (req: ReqCreateCommunityPost) => {
  const result = await fetcher.post<ResCreateCommunityPost>(
    "/community/posts",
    req.body,
  );
  return result.data;
};
