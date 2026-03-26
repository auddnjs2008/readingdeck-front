import fetcher from "../fetcher";
import type { DeckCardType, DeckMode } from "@/service/deck/types";
import type { CommunityPost } from "./types";

export type ReqGetCommunityPosts = {
  query?: {
    take?: number;
    cursor?: number;
    sort?: "latest" | "oldest";
    mode?: DeckMode;
    type?: DeckCardType;
  };
};

export type ResGetCommunityPosts = {
  items: CommunityPost[];
  meta: {
    total: number;
    take: number;
    cursor: number;
    nextCursor: number | null;
  };
};

export const getCommunityPosts = async (req?: ReqGetCommunityPosts) => {
  const result = await fetcher.get<ResGetCommunityPosts>("/community/posts", {
    params: req?.query,
  });
  return result.data;
};
