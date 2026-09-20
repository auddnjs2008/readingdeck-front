import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/providers/get-query-client";
import { getCommunityPostsServer } from "@/entities/community/api/getCommunityPosts.server";
import { COMMUNITY_FEED_REQUEST, communityPostsOptions } from "@/entities/community/model/queries/community-posts-options";

import CommunityPageClient from "./page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "공개 덱",
  description: "ReadingDeck 커뮤니티에서 독서 카드와 공유된 덱을 만나보세요.",
  alternates: { canonical: "/community" },
};

export default async function CommunityPage() {
  const queryClient = getQueryClient();
  await queryClient.fetchInfiniteQuery({
    ...communityPostsOptions(COMMUNITY_FEED_REQUEST, getCommunityPostsServer),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityPageClient />
    </HydrationBoundary>
  );
}
