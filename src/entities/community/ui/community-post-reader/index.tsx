"use client";

import { useState } from "react";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";

import type { CommunityPostDetail } from "@/entities/community/model/types";
import type { ReadView } from "@/entities/community/lib/community-post-reader";
import { CommunityComments } from "@/entities/community/ui/community-comments";
import { CommunityPostCardList } from "@/entities/community/ui/community-post-card-list";
import { CommunityPostGraphView } from "@/entities/community/ui/community-post-graph-view";
import { CommunityPostHero } from "@/entities/community/ui/community-post-hero";
import { CommunityPostViewTabs } from "@/entities/community/ui/community-post-view-tabs";
import { ScrollToTopButton } from "@/shared/ui/scroll-to-top-button";

export function CommunityPostReader({
  post,
}: {
  post: CommunityPostDetail;
}) {
  const { data: profile, isError } = useMyProfileQuery({ retry: false });
  const currentUserId = isError ? undefined : profile?.id;
  const [manualView, setManualView] = useState<ReadView | null>(null);
  const defaultView: ReadView = post.deckMode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const isOwner = post.author.id === currentUserId;

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-10 px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto w-full max-w-4xl">
          <CommunityPostHero post={post} isOwner={isOwner} />
        </div>

        <section className="mx-auto w-full max-w-[1120px]">
          {post.deckMode === "graph" ? (
            <CommunityPostViewTabs
              activeView={activeView}
              onViewChange={setManualView}
            />
          ) : null}

          <div className="py-8">
            {activeView === "list" ? (
              <CommunityPostCardList nodes={post.snapshot.nodes} />
            ) : (
              <CommunityPostGraphView snapshot={post.snapshot} />
            )}
          </div>
        </section>

        <div className="mx-auto w-full max-w-4xl">
          <CommunityComments postId={post.id} currentUserId={currentUserId} />
        </div>
      </main>
      {activeView === "list" ? <ScrollToTopButton /> : null}
    </div>
  );
}
