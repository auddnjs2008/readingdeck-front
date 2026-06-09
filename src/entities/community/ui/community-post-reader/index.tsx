"use client";

import { useState } from "react";

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
  currentUserId,
}: {
  post: CommunityPostDetail;
  currentUserId?: number;
}) {
  const [manualView, setManualView] = useState<ReadView | null>(null);
  const defaultView: ReadView = post.deckMode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const isOwner = post.author.id === currentUserId;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <CommunityPostHero post={post} isOwner={isOwner} />

        <section className="overflow-hidden rounded-[34px] border border-border/80 bg-card shadow-[0_22px_48px_rgba(63,54,49,0.08)]">
          {post.deckMode === "graph" ? (
            <CommunityPostViewTabs
              activeView={activeView}
              onViewChange={setManualView}
            />
          ) : null}

          <div className="px-6 py-8 md:px-8">
            {activeView === "list" ? (
              <CommunityPostCardList nodes={post.snapshot.nodes} />
            ) : (
              <CommunityPostGraphView snapshot={post.snapshot} />
            )}
          </div>
        </section>

        <CommunityComments postId={post.id} currentUserId={currentUserId} />
      </main>
      {activeView === "list" ? <ScrollToTopButton /> : null}
    </div>
  );
}
