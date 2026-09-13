import type { Metadata } from "next";
import { Suspense } from "react";
import { getCommunityPostServer } from "@/entities/community/api/getCommunityPost.server";

import {
  CommunityPostDetail,
  CommunityPostDetailSkeleton,
} from "@/entities/community/ui/community-post-detail";

type CommunityDetailPageProps = {
  params: Promise<{ postId: string }>;
};

export async function generateMetadata({ params }: CommunityDetailPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getCommunityPostServer({ path: { postId: Number(postId) } });
  const description = (post.caption || post.deckDescription || post.primaryThought || "ReadingDeck에서 공유된 독서 덱을 읽어보세요.").slice(0, 160);
  const url = `/community/${post.id}`;
  const bookCover = post.snapshot.nodes.find(
    (node) => node.book?.backgroundImage,
  )?.book?.backgroundImage;

  return {
    title: post.deckName,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.deckName,
      description,
      url,
      images: bookCover
        ? [{ url: bookCover }]
        : [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

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
