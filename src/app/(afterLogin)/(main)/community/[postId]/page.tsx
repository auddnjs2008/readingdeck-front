import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CommunityPostDetail,
  CommunityPostDetailSkeleton,
} from "@/entities/community/ui/community-post-detail";

export const metadata: Metadata = {
  title: "공유된 덱",
};

type CommunityDetailPageProps = {
  params: Promise<{ postId: string }>;
};

export default function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  return (
    <Suspense fallback={<CommunityPostDetailSkeleton />}>
      {params.then(({ postId }) => (
        <CommunityPostDetail postId={Number(postId)} />
      ))}
    </Suspense>
  );
}
